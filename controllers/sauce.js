const Sauce = require("../models/Sauce");
const fs = require("fs");

// afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// afficher une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json(error));
};

// creér une sauce
exports.createSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  console.log("sauceObj", sauceObj);
  // verification de forcing id
  delete sauceObj._id;
  const sauce = new Sauce({
    ...sauceObj,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce enregistré" }))
    .catch((error) => res.status(400).json({ error }));
};

// modifier une sauce
exports.modifySauce = (req, res, next) => {
  const userId = req.userId;
  console.log("userID", userId);
  // Recuperer la sauce existante
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // Si la sauce n'existe pas => error
    if (!sauce) {
      console.log(sauce);
      throw Error("Sauce inexistante");
    }
    // Si elle existe, => verifie que son userId correspond a req.userId
    else if (userId != sauce.userId) {
      throw Error("Une erreur est survenue");
    }
    // Si tout est ok, on procede
    console.log("continue");
    const sauceObj = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          // créer le lien images
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
      .then(() => res.status(200).json({ message: "sauce modifiée" }))
      .catch((error) => res.status(400).json({ error }));
  });
};

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        throw Error("Sauce inexistante");
      }
      if (req.userId != sauce.userId) {
        throw Error("Une erreur est survenue");
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      // supprimer un fichier img puis callback suppression sauce
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "sauce supprimé" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeOrDislike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Verifie si l'utilisateur a soit liker ou disliker
      const sauceLiked = sauce.usersLiked.indexOf(req.body.userId);
      const sauceDisliked = sauce.usersDisliked.indexOf(req.body.userId);
      console.log(sauceLiked, sauceDisliked);

      // Si oui on retire des like/dislike
      sauce.usersDisliked.splice(sauceDisliked, 1);
      sauce.usersLiked.splice(sauceLiked, 1);
      // Si non on procede normalement

      // Cas ou l'user like
      if (req.body.like == 1) {
        sauce.usersLiked.push(req.body.userId);

        // Cas ou l'user dislike
      } else if (req.body.like == -1) {
        sauce.usersDisliked.push(req.body.userId);
      }
      Sauce.updateOne(
        { _id: req.params.id },
        {
          usersLiked: sauce.usersLiked,
          likes: sauce.usersLiked.length,
          usersDisliked: sauce.usersDisliked,
          dislikes: sauce.usersDisliked.length,
        }
      )
        .then(() =>
          res.status(200).json({
            message:
              req.body.like == 1
                ? "Vous avez aimé la sauce"
                : req.body.like == -1
                ? "Vous n'avez pas aimé la sauce"
                : "Vous avez retiré votre vote",
          })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
