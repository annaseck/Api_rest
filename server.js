const express = require('express');
const mongoose = require('mongoose');
const User = require('./modeles/user');
const dotenv = require('dotenv');
//Charger les variables d'environnements
dotenv.config({ path: './config/.env' });

//Créer une application express
const app = express();
const port = 3000;

//Connexion avec la base de données
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connexion à mongoDb réussie!');    
}).catch((err) => {
    console.log('Erreur lors de la connexion à mongoDb', err);    
});

//Middleware pour les fichier json
app.use(express.json());

//Retourner tous les utilisateus
app.get('/getUsers', async (req, res) => {
    const users = await User.find();
    return res.status(201).json(users);
});

//Ajouter un nouvel utilisateur
app.post('/newUser', async (req, res) => {
    const {name, email, phone} = req.body
    try {
        const user = await User.create({
            name,
            email,
            phone
        })
        return res.status(201).json({message:"user ajouté avec succès"});
    } catch (error) {
        console.log("Erreur lors de l'ajout de l'utilisateur", error);
        return res.status(500).json({error:"Erreur lors de l'ajout de l'utilisateur"});
    }
});

//Modifier un utilisateur par son id
app.put('/update/:id', async (req, res) => {
    const {id} = req.params
    const newData = {email: "newdata@email.com"}
    try {
        if(!id) return res.json({message:"L'id est requis!"});
        const doc = await User.findByIdAndUpdate(id, newData, {new : true});
        return res.status(201).json(doc);
    } catch (error) {
        console.log("Mise à jour échouer", error);
        return res.status(500).json({error:"Mise à jour échouer"});
    }
});

//Supprimer un utilisateur par son id
app.delete("/delete/:id", async (req, res) => {
    try {
        const {id} = req.params
        await User.findByIdAndDelete(id);
        return res.json({message:"Document supprimer avec succès"});       
    } catch (error) {
        console.log("Erreur lors de la suppression",error);
        return res.status(500).json({error:"Erreur lors de la suppression"});
    }
});

//Lancer le serveur sur le port 3000
app.listen(port, () => {
    console.log('Server is running on port: ',port);        
});