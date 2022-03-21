const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require("../models/user")
const validator = require('email-validator');

exports.signup = (req, res, next) => {
    if (!validator.validate(req.body.email)) return res.status(403).json({ message: 'Le format de l\'adresse mail est incorrect.' })
    if (req.body.password.length > 8) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const myUser = new user({
                    email: req.body.email,
                    password: hash
                });
                myUser.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé.' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else return res.status(403).json({ message: 'Votre mot de passe doit contenir 8 caractères minimum.' })
};

exports.login = (req, res, next) => {
    user.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}

