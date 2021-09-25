const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../models/User');

// ****************** Inscription de l'utilisateur ******************
exports.signup = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then( userFound => {
        if (!userFound) {
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash,
                    pseudo: req.body.pseudo,
                    image: "http://localhost:3000/images/user_default.jpg"
                });
            user.save()
                .then(user => res.status(201).json( user ))
                .catch(error => res.status(400).json({ error }));
            })
        } else {
            return res.status(409).json({ 'error': 'Utilisateur déja existant !'});
        }
    }) 
};

// ****************** Connexion de l'utilisateur ******************
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error : 'Utilisateur non trouvé'})
        } 
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error : 'Mot de passe incorrect'})
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
};

// ****************** Afficher mon profil ******************

exports.getMyProfile = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    console.log(userId);
    User.findOne({ _id: userId })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
};

// ****************** Afficher le profil d'un user en fonction de son id ******************
exports.getOneUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    User.findOne({ _id: req.params.id})
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
};

// ****************** Afficher tous les utilisateurs ******************
exports.getAllUsers = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // const userId = decodedToken.userId;
    User.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(404).json({ error }));
};

// ****************** Modifier mon profil ******************

exports.modifyUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    
    User.findOne({ _id : userId})
    .then(userFound => {
        if (!userFound){
            return res.status(404).json({ error : 'Utilisateur non trouvé'})
        }
        User.updateOne({_id: userId},{
            email: req.body.email,
            pseudo: req.body.pseudo,
            image: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: req.body.image
        
        })
        .then(() => res.status(201).json({ message: 'Profil modifié avec succès' }))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}; 


// ****************** Supprimer mon profil ******************

exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    User.findOne({ _id: userId})
    .then(user => {
        if (!user) {
            return res.status(404).json({ error : 'Utilisateur non trouvé'})
        }
        if (user.image !== "http://localhost:3000/images/user_default.jpg") {
            const filename = user.image.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                User.deleteOne({ _id: userId })
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé'}))
                    .catch(error => res.status(400).json({ error }));
            }) 
        } else {
            User.deleteOne({ _id: userId })
                .then(() => res.status(200).json({ message: 'Utilisateur supprimé'}))
                .catch(error => res.status(400).json({ error }));
        } 
    }) 
    .catch(error => res.status(500).json({ error })); 
};