const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("./config/connexion");
const user = require("./models/user");
const vehicule = require("./models/vehicule");
const conducteur = require("./models/conducteur");
const scontrat = require("./models/sous-contrat");
const infosat = require("../car_infos.json");
const display_fields = require("../display_info.json");
require("./car_infos");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/add_user", async (req, res) => {
  console.log("hallo");
  const data = req.body;
  const subcontract = {};
  const driver = {};
  const vehicul = {};
  var flag = "sous-contrat";
  for (var key in data) {
    if (Object.keys(scontrat.schema.tree).includes(key))
      subcontract[key] = data[key];
    if (Object.keys(conducteur.schema.tree).includes(key))
      driver[key] = data[key];
    else if (Object.keys(vehicule.schema.tree).includes(key))
      vehicul[key] = data[key];
  }
  console.log("subcntr---------> ");
  console.log(subcontract);
  console.log("driver---------> ");
  console.log(driver);
  console.log("vehicul---------> ");
  console.log(vehicul);
  /*     console.log(Object.keys(data).length)
    console.log(data) */
  /*     const us = new user(data);
    us.save();
    res.redirect("/"); */

  const vh = new vehicule(vehicul);
  await vh.save(function (err) {
    if (err) return console.log(err);
  });
  const cd = new conducteur(driver);
  await cd.save();
  const sc = new scontrat(subcontract);
  sc.conducteur = cd;
  sc.vehicule = vh;
  await sc.save();
  conducteur.findByIdAndUpdate(cd._id, { sous_contrat: sc._id }).exec();
  vehicule.findByIdAndUpdate(vh._id, { sous_contrat: sc._id }).exec();
  res.send({});
});

app.get("/", (req, res) => {
  var data = [];
  var datos = [];
  scontrat
    .find({})
    .populate("conducteur")
    .populate("vehicule")
    .exec()
    .then((docs) => {
      for (var i = 0; i < docs.length; i++) {
        datos.push({});

        for (var prop of Object.keys(docs[i].toJSON())) {
          if (prop == "vehicule" || prop == "conducteur") {
            for (var special_prop of Object.keys(docs[i][prop].toJSON())) {
              datos[i][special_prop] = docs[i][prop][special_prop];
            }
            continue;
          }
          if (prop == "_id") {
            datos[i]["id"] = docs[i][prop];
            continue;
          }
          datos[i][prop] = docs[i][prop];
        }
      }
      res.send({
        results: datos,
        infosaat: infosat,
        disp_fields: display_fields,
      });
    });
  /*           console.log(Object.keys(data.toJSON()))
          console.log(Object.keys(data['vehicule'].toJSON())) */
});

app.post("/change", (req, res) => {
  console.log(" bodyyy--->", req.body);
  const data = req.body;
  data.map((elt) => {
    const aux = {};
    aux[elt.field] = elt.value;
    if (Object.keys(scontrat.schema.tree).includes(elt.field))
      scontrat.findByIdAndUpdate(elt.id, aux, (err) => {
        if (err) throw err;
      });
    else if (Object.keys(vehicule.schema.tree).includes(elt.field)) {
      vehicule.findOneAndUpdate({ sous_contrat: elt.id }, aux, (err, docs) =>
        console.log(docs)
      );
    } else if (Object.keys(conducteur.schema.tree).includes(elt.field)) {
      conducteur.findOneAndUpdate({ sous_contrat: elt.id }, aux, (err, docs) =>
        console.log(docs)
      );
    }
  });
});
app.post("/delete", (req, res) => {
  const data = req.body;
  console.log(req.body);
  data.map(async (elt) => {
    const aux = {};
    aux["_id"] = elt;
    console.log("id--->", elt);
    await scontrat.deleteOne(aux).exec();
  });
  return res.send({ deleted: true });
});
app.post("/go_home", (req, res) => {
  res.send({ name: "bilal" });
});

app.listen(3001, () => {
  console.log("server is working on port 3001");
});
