let mongoose = require("mongoose");
const vehiculeSchema = new mongoose.Schema({
  sous_contrat: mongoose.ObjectId,
  Ref_Parc_Contrat_Loueur: String,
  WW: String,
  n_de_Chassis: String,
  D_M_Circulation: String,
  P_F_: String,
  N_Immat: String,
  Marque: String,
  Cles: String,
  Couleur: String,
  Duree: String,
  Code_Radio: String,
  Ref_Pneus: String,
  RECO_ATTR_VEHICUL: String,
  Echeance_Visite_Tech: String,
  Cartes_Verte: String,
  Vignete: String,
  Assurance_Contrat_En_Cours: String,
  TAG_Jawaz_n: String,
  Plafond_Carte_Carb_N: String,
  Dotation: String,
  Date_expirationD: String,
  carte_carburant: String,
});
const vehicule = mongoose.model("vehicules", vehiculeSchema);

module.exports = vehicule;
