let mongoose = require("mongoose");
const contratSchema = new mongoose.Schema({

    ORD: String,
    Contrat_no: String,
    Assurance_Contrat_En_Cours :String ,

});
const contrat = mongoose.model("contrat", contratSchema);

module.exports = contrat;