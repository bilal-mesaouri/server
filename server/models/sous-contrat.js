let mongoose = require("mongoose");
const conducteur = require("./conducteur");
const vehicule = require("./vehicule");
const sous_contratSchema = new mongoose.Schema({
  Ref_Parc_Contrat_Loueur: String,
  Duree: String,
  No_Parc: String,
  Montant_Mensuel_H_T: String, //should be an array
  Date_Debut: String,
  Date_Fin: String,
  Date_Prevue_de_la_Restitution: String,
  Date_Effective_de_la_Restitution: String,
  KM_Date_de_Retour: String,
  Remise_Accodee: String,
  Montant_Mensuel_48: String,
  Montant_TVA_: String,
  Montant_TTC: String,
  Montant_TTC_48: String,
  Montant_du_Marche_TTC: String,
  Montant_Franchise_HT: String,
  KM_Limite_a_KM: String,
  KM_Limite_a: String,
  Fonct_SERVICE: String,

  conducteur: { type: mongoose.Schema.Types.ObjectId, ref: "conducteurs" },
  vehicule: { type: mongoose.Schema.Types.ObjectId, ref: "vehicules" },
  contrat: { type: mongoose.Schema.Types.ObjectId, ref: "contrats" },
});

// schema
sous_contratSchema.pre("deleteOne", function () {
  let id = this.getQuery()["_id"];
  console.log(` was Removing!`);
  console.log(this.getQuery()["_id"]);
  conducteur.deleteOne({ sous_contrat: id }).exec();
  vehicule.deleteOne({ sous_contrat: id }).exec();
});
const sous_contrat = mongoose.model("sous_contrats", sous_contratSchema);

module.exports = sous_contrat;
