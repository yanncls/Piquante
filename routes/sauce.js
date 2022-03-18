const express = require('express');
const sauce = require('../models/sauce');
const router = express.Router();

const Auth = require('../models/user');

router.post('/', (req, res, next) => {
    delete req.body._id;
    const sauce = new sauce({
        ...req.body
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'objet enregistré'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error
            });
        }
    );
});

router.get('/:id', (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});

router.put('/:id', (req, res, next) => {
    const thing = new Thing({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    Thing.updateOne({ _id: req.params.id }, thing).then(
        () => {
            res.status(201).json({
                message: 'Thing updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

router.delete('/:id', (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id }).then(
        () => {
            res.status(200).json({
                message: 'Deleted!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

router.get('/' +
    '', (req, res, next) => {
        Thing.find().then(
            (things) => {
                res.status(200).json(things);
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
    });

module.exports = router;
