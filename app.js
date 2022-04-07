const cookieSession = require('cookie-session');
const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');



// hide id & password
require('dotenv').config()

const expiryDate = new Date(Date.now() + 3600000);

const app = express();


app.use(cookieSession({
    name: 'session',
    keys: process.env.S3CRET_SESSION,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: expiryDate,
    }
}))
app.use(helmet());
app.use(express.json());
app.use(cookieParser());




const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');



// mongodb connect
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/myFirstDatabase?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// // laisse l'application lire l'image qui provient du serveur web 
app.use(function (req, res, next) {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
    next()
});

app.use(cors({
    origin: '*',
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content',
        'Accept',
        'Content-Type',
        'Authorization'
    ],
    methods: [
        'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'
    ]
}));


// logique de route
// dossier static image
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;

