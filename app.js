const dotenv = require('dotenv');// Récupération des extensions
const express = require("express"); // import Framework JS


const app = express(); // Création de l'application Express

dotenv.config();


const bodyParser = require("body-parser"); // Import du package body-parser (parse automatiquement les requêtes en JSON)

// Pour mettre en place le chemin d'accès à un fichier téléchargé par l'utilisateur
const path = require('path');




// Déclaration des routes pour les sauces et les utilisateurs
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//MONGO DB : données sont stockées comme des collections de documents individuels décrits en JSON (JavaScript Object Notation)
// importation mongoose 
const mongoose = require('mongoose');

const password = process.env.DB_PASSWORD
const username= process.env.DB_USER
const uri =`mongodb+srv://${username}:${password}@cluster0.t2jpo1b.mongodb.net/?retryWrites=true&w=majority`;


// API est à présent connectée à la base de données, et nous pouvons commencer à créer des routes serveur
mongoose.connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());



const cors  = require("cors")
app.use(cors())

/*
// Middleware général pour gérer le CORS (Cross origin ressource sharing) de l'application
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Tout le monde peut accéder à l'application depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Accepte certains en-têtes pour accéder à l'application
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // Autorise ces méthodes
    // GET : permet de placer des paramètres directement dans une url
    // POST : prends en paramètre un chemin qui lorsqu’il sera appelé, exécutera la fonction placée en second paramètre
    // PATCH : applique des modifications partielles à une ressource
    // PUT : crée une nouvelle ressource ou remplace une représentation de la ressource ciblée par le contenu de la requête
    // DELETE : supprime la ressource indiquée
    // OPTIONS :utilisée pour décrire les options de communication pour la ressource ciblée. 
    //Le client peut renseigner un URL spécifique pour la méthode OPTIONS, ou un astérisque
    // (*) pour interroger le serveur dans sa globalité
  next(); // Fonction pour passer au middleware suivant
});
*/
   
  
//app.use(bodyParser.json());

// import middleware express-rate-limit
const rateLimit = require("express-rate-limit"); 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limiter chaque IP à 100 requêtes par windowMs
});


// Middleware de téléchargement de fichiers (images des sauces)
app.use('/images', express.static(path.join(__dirname, 'images')));
// Routes pour accéder aux sauces et aux utilisateurs 
// middleware "limiter" uniquement pour les routes utilisateurs
app.use("/api/auth", limiter, userRoutes); 
app.use("/api/sauces", sauceRoutes);



// package sécurité Helmet aide à protéger l'app de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP. Choix de le retirer car impact affichage des images.
//const helmet = require('helmet');
//app.use(helmet());

module.exports = app; // Exportation de l'application créée


