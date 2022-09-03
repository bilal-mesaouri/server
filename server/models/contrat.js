let mongoose = require("mongoose");
const contratSchema = new mongoose.Schema({

    Annee: String,
    contrat_no: String,
    Contrat_echu_En_Cours :String ,
    Prestataire:String,
    A_O_no:String,
    sous_contrats: [{ type: mongoose.Schema.Types.ObjectId, ref: "sous_contrats" }],


});
const contrat = mongoose.model("contrats", contratSchema);

module.exports = contrat;