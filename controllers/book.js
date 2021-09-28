
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Book = require('../models/Book');


// ****************** Création d'un Livre ******************

exports.createBook = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    User.findOne({ _id : userId})
    .then(userFound => {
        if (!userFound) {
            return res.status(400).json({ message: 'Utilisateur inéxistant'})
        } 
    })
    .catch(error => res.status(500).json({ error })); 

     Book.create({
        userId: userId,
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        comment: req.body.comment,
        finish: req.body.finish,
        wish: req.body.wish,
        isBeingRead: req.body.isBeingRead

    })
    .then(book => res.status(201).json({ book }))
    .catch(error => res.status(400).json({ error }));
        
}


// ****************** Afficher tous les livres d'un utilisateur ******************

exports.getAllUsersBooks = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    Book.find({ userId: userId})
    .then(books => {
        res.status(200).json({ books })
    })
        
    .catch(error => res.status(400).json({ error }));
};

// ****************** Afficher un livre en fonction de son id ******************

exports.getOneBook = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    Book.findOne({ _id: req.params.id})
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// ****************** Modifier un livre ******************

exports.modifyBook = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    
    Book.findOne({ _id : req.params.id})
    .then(bookFound => {
        if (!bookFound){
            return res.status(404).json({ error : 'Livre non trouvé'})
        }
        Book.updateOne({_id: req.params.id},{
            userId: userId,
            title: req.body.title,
            author: req.body.author,
            imageUrl: req.body.imageUrl,
            comment: req.body.comment,
            finish: req.body.finish,
            wish: req.body.wish,
            isBeingRead: req.body.isBeingRead
        
        })
        .then(() => res.status(201).json({ message: 'Livre modifié avec succès' }))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// ****************** Supprimer un livre ******************

exports.deleteBook = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    Book.findOne({ _id: req.params.id})
        .then(() => {
            Book.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Livre supprimé' }))
            .catch(error => res.status(400).json({ error }));
        }) 
    .catch(error => res.status(500).json({ error })); 
};