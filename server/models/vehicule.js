let mongoose = require("mongoose");
const vehiculeSchema = new mongoose.Schema({
  sous_contrat: mongoose.ObjectId,
  
  WW: String,
  n_de_Chassis: String,
  D_M_Circulation: String,
  P_F_: String,
  N_Immat: String,
  Marque: String,
  Cles: String,
  Couleur: String,
  Code_Radio: String,
  Ref_Pneus: String,
  RECO_ATTR_VEHICUL: String,
  Echeance_Visite_Tech: String,
  Echeance_Aut_Circulation: String,
  Assurance_Contrat_En_Cours: String,
  Cartes_Verte: String,
  Vignete: String,

});
const vehicule = mongoose.model("vehicules", vehiculeSchema);

module.exports = vehicule;
