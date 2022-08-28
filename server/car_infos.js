contrat=[    
    "contrat",
{ key:10,name:'ORD',label:'ORD' , type:"text"},
{ key:11,name:'Contrat',label:'Contrat_no' , type:"text"},
]

sous_contrat =[   
 "sous-contrat",
{ key:12,name:'Parc',label:'No_Parc' , type:"text"},
{ key:13,name:'Année',label:'Annee' , type:"text"},
{ key:9,name:'A.O. n°',label:'A_O_no' , type:"text"},
{ key:14,name:'Montant Mensuel H.T.',label:'Montant_Mensuel_H_T' , type:"text"},
{ key:15,name:'Date Début',label:'Date_Debut' , type:"text"},
{ key:16,name:'Date Fin',label:'Date_Fin' , type:"text"},
{ key:17,name:'Date Prévue de la Restitution',label:'Date_Prevue_de_la_Restitution' , type:"text"},
{ key:18,name:'Date Effective de la Restitution',label:'Date_Effective_de_la_Restitution' , type:"text"},
{ key:20,name:'KM Date de Retour',label:'KM_Date_de_Retour' , type:"text"},
{ key:21,name:'Contrat échu En Cours',label:'Contrat_echu_En_Cours' , type:"text"},
{ key:21,name:'Remise Accodée	            ',label:'Remise_Accodee' , type:"text"},
{ key:21,name:'Montant Mensuel H.T. * 48	',label:'Montant_Mensuel_48' , type:"text"},
{ key:21,name:'Montant T.V.A.	            ',label:'Montant_TVA_' , type:"text"},
{ key:21,name:'Montant T.T.C.	            ',label:'Montant_TTC' , type:"text"},
{ key:21,name:'Montant T.T.C. * 48	        ',label:'Montant_TTC_48' , type:"text"},
{ key:21,name:'Montant du Marché TTC        ',label:'Montant_du_Marche_TTC' , type:"text"},
{ key:21,name:'Montant Franchise HT	        ',label:'Montant_Franchise_HT', type:"text"},
{ key:21,name:'KM Limité à	KM (+) (-)      ',label:'KM_Limite_a_KM' , type:"text"},
{ key:21,name:'Prestataire                  ',label:'Prestataire' , type:"text"},
{ key:21,name:'Fonct   SERVICE              ',label:'Fonct_SERVICE' , type:"text"},]

Conducteur = [        
    "Conducteur",
    { key:10,name:'Direction',label:'Direction' , type:"text"},
    { key:10,name:'Conducteur',label:'Conducteur' , type:"text"},
    { key:10,name:'Matricule',label:'Matricule' , type:"text"},
    { key:10,name:'Grade',label:'Grade' , type:"text"},
    { key:10,name:'Filiale',label:'Filiale' , type:"text"},
]

vehicule =[
    "Vehicule",
    { key:10,name:'Réf./Parc Contrat Loueur',label:'Ref_Parc_Contrat_Loueur' , type:"text"},
    { key:10,name:'WW',label:'WW' , type:"text"},
    { key:10,name:'n° de Châssis',label:'n_de_Chassis' , type:"text"},
    { key:10,name:'D.M Circulation',label:'D_M_Circulation' , type:"text"},
    { key:10,name:'P.F.',label:'P_F_' , type:"text"},
    { key:10,name:'N° Immat.',label:'N_Immat' , type:"text"},
    { key:10,name:'Marque',label:'Marque' , type:"text"},
    { key:10,name:'Clés',label:'Cles' , type:"text"},
    { key:10,name:'Couleur',label:'Couleur' , type:"text"},
    { key:10,name:'Durée',label:'Duree' , type:"text"},
    { key:10,name:'Code Radio',label:'Code_Radio' , type:"text"},
    { key:10,name:'Réf. Pneus',label:'Ref_Pneus' , type:"text"},
    { key:10,name:'RECO.ATTR. VEHICULE',label:'RECO_ATTR_VEHICUL' , type:"text"},
    { key:10,name:'Échéance Visite Tech.',label:'Echeance_Visite_Tech' , type:"text"},
    { key:10,name:'Assurance Contrat En Cours',label:'Assurance_Contrat_En_Cours' , type:"text"},
    { key:10,name:'Cartes Verte',label:'Cartes_Verte' , type:"text"},
    { key:10,name:'Vignète',label:'Vignete' , type:"text"},
    { key:10,name:'TAG Jawaz n°',label:'TAG_Jawaz_n' , type:"text"},
    { key:10,name:'Plafond Carte Carb.N°',label:'Plafond_Carte_Carb_N' , type:"text"},
    { key:10,name:'Dotation',label:'Dotation' , type:"text"},
    { key:10,name:'Date expirationD',label:'Date_expirationD' , type:"text"},
    { key:10,name:'carte carburant',label:'carte_carburant' , type:"text"},
]

infos=sous_contrat.concat(Conducteur.concat(vehicule))

search_infos =[
    {name:'Make ',label:'make' , type:"text"},
    {name:'Model ',label:'model' , type:"text"},
    {name:'Price min',label:'price_min' , type:"number"},
    {name:'Price max',label:'price_max' , type:"number"},
    {name:'Year min',label:'year_min' , type:"number"},
    {name:'Year max',label:'year_max' , type:"number"},
    {name:'month',label:'month' , type:"text"},
    {name:'Color',label:'color' , type:"text"},
    {name:'License Plate',label:'License_Plate' , type:"text"},
    {name:'Serial number',label:'Serial_number' , type:"text"},
    {name:'Location of Vehicle',label:'Location_of_Vehicle' , type:"text"},
]
 ops={
     price_min:{datakey:'price',op:'$gt'},
     price_max:{datakey:'price',op:'$lt'},
     year_min:{datakey:'year',op:'$gt'},
     year_max:{datakey:'year',op:'$lt'},
 }
 
    


module.exports = infos,search_infos,ops