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





// exports.likeSauce = (req, res, next) => {
//     Sauce.findOne({ _id: req.params.id})
//     .then(sauce => {
//         let score = 0;
//         let tabLike = [];
//         let tabDislike = [];

//     })
//     .catch();
// }