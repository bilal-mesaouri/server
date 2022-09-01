let mongoose = require("mongoose");
const conducteurSchema = new mongoose.Schema({
    sous_contrat: mongoose.ObjectId,
    Direction:String,
    Conducteur:String,
    Matricule:String,
    Grade:String,
    Filiale:String,
    TAG_Jawaz_n: String,
    Plafond: String,
    Dotation: String,
    Date_expirationD: String,
    carte_carburant: String,
    


});
const conducteur = mongoose.model("conducteurs", conducteurSchema);

module.exports = conducteur;