const express = require('express');
const router = express.Router();


const sauceCtrl = require('../controllers/sauce');
const Auth = require('../models/user');

router.post('/', sauceCtrl.createSauce);
router.put('/:id', sauceCtrl.modifySauce);
router.delete('/:id', sauceCtrl.deleteSauce);
router.get('/:id', sauceCtrl.getOneSauce);
router.get('/', sauceCtrl.getAllSauce);

module.exports = router;
