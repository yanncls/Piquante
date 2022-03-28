const Sauce = require('../models/Sauce')
const fs = require('fs');

// afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// afficher une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json(error));
};

// creér une sauce 
exports.createSauce = (req, res, next) => {
    const sauceObj = JSON.parse(req.body.sauce)
    delete sauceObj._id;
    const sauce = new Sauce({
        ...sauceObj,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'sauce enregistré' }))
        .catch(error => res.status(400).json({ error }));
};

// modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObj = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            // créer le lien images
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'sauce modifiée' }))
        .catch(error => res.status(400).json({ error }));
};

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            // supprimer un fichier img puis callback suppression sauce
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'sauce supprimé' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// like or dislike sauce
exports.likeOrDislike = (req, res, next) => {
    const likeState = req.body.like;
    if (likeState == 1) {
        // cas ou l'user like
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'Like ajouté' }))
            .catch(error => res.status(400).json({ error }));
    } else if (likeState == -1) {
        // cas ou l'user dislike
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
            .catch(error => res.status(400).json({ error }));
    } else if (likeState == 0) {
        // cas ou l'user retire son vote
        Sauce.findOne({ _id: req.params.id })
            .then(Sauce => {
                // retire le like
                if (Sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { like: req.body.like-- }, $pull: { usersLiked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Like supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                    // retire le dislike
                } else if (Sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislike: req.body.dislike-- }, $pull: { usersDisliked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Dislike supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
}



