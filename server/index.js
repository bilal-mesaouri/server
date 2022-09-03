const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("./config/connexion");
const user = require("./models/user");
const vehicule = require("./models/vehicule");
const conducteur = require("./models/conducteur");
const scontrat = require("./models/sous-contrat");
const contrat = require("./models/contrat");
const display_fields = require("../display_info.json");
var cookieParser = require("cookie-parser");
app.use(cookieParser());
const { requireAuth } = require("./middleware/requireAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/get_fields", requireAuth, (req, res) => {
  res.send({ flds: display_fields });
});

app.post("/add_user", requireAuth, async (req, res) => {
  console.log("hallo");
  const data = req.body;
  console.log(data);
  const subcontract = {};
  const driver = {};
  const vehicul = {};
  const contrats = {};
  for (var key in data) {
    if (Object.keys(scontrat.schema.tree).includes(key))
      subcontract[key] = data[key];
    if (Object.keys(conducteur.schema.tree).includes(key))
      driver[key] = data[key];
    if (Object.keys(vehicule.schema.tree).includes(key))
      vehicul[key] = data[key];
    if (Object.keys(contrat.schema.tree).includes(key))
      contrats[key] = data[key];
  }

  var ct;
  if (Object.keys(data).includes("contrat_numb")) {
    console.log(data["contrat_numb"])
    ct = await contrat.findOne({ contrat_no: data["contrat_numb"] });
    console.log('look at me',ct)
    if (!ct) res.sendStatus(404);
    else {
      data["contrat_no"] = ct._id;
    }
  } else {
    console.log("contrats", contrats);

    ct = new contrat(contrats);
    await ct.save();
    console.log("ct", ct);
    data["contrat_no"] = ct._id;
  }
  const vh = new vehicule(vehicul);
  await vh.save();
  const cd = new conducteur(driver);
  await cd.save();
  const sc = new scontrat(subcontract);
  sc.conducteur = cd;
  sc.vehicule = vh;
  sc.contrat = ct;

  await sc.save();
  conducteur.findByIdAndUpdate(cd._id, { sous_contrat: sc._id }).exec();
  vehicule.findByIdAndUpdate(vh._id, { sous_contrat: sc._id }).exec();
  contrat
    .findByIdAndUpdate(ct._id, { $push: { sous_contrats: sc._id } })
    .exec();
  res.send({});
});

app.get("/", requireAuth, (req, res) => {
  var data = [];
  var datos = [];
  scontrat
    .find({})
    .populate("conducteur")
    .populate("vehicule")
    .populate("contrat")

    .exec()
    .then((docs) => {
      docs.map((element) => {
        const elt = element.toJSON();
        Object.defineProperty(
          elt,
          "id",
          Object.getOwnPropertyDescriptor(elt, "_id")
        );
        delete elt["_id"];
        data = { ...elt, ...elt.contrat, ...elt.conducteur, ...elt.vehicule };
        delete data.vehicule;
        delete data.conducteur;
        delete data.contrat;
        console.log("data ->->->", data);
        datos.push(data);
      });

      console.log("datos", datos);
      res.send({
        results: datos,
        disp_fields: display_fields,
      });
    });
});

app.post("/change", requireAuth, (req, res) => {
  console.log(" bodyyy--->", req.body);
  const data = req.body;
  data.map(async (elt) => {
    const aux = {};
    aux[elt.field] = elt.value;
    if (Object.keys(scontrat.schema.tree).includes(elt.field)) {
      scontrat.findByIdAndUpdate(elt.id, aux, (err) => {
        if (err) throw err;
      });
    } else if (Object.keys(vehicule.schema.tree).includes(elt.field)) {
      vehicule.findOneAndUpdate({ sous_contrat: elt.id }, aux, (err, docs) =>
        console.log(docs)
      );
    } else if (Object.keys(conducteur.schema.tree).includes(elt.field)) {
      conducteur.findOneAndUpdate({ sous_contrat: elt.id }, aux, (err, docs) =>
        console.log(docs)
      );
    } else if (Object.keys(contrat.schema.tree).includes(elt.field)) {
      console.log("$$$$$$");
      const ct = await scontrat.findOne({ _id: elt.id });

      console.log(ct);
      console.log("aux", aux);
      const ctt = await contrat.findOneAndUpdate({ _id: ct.contrat }, aux);
      console.log(ctt);
    }
  });
});
app.post("/delete", requireAuth, (req, res) => {
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

app.post("/login", async (req, res) => {
  console.log(req.body);
  const data = req.body;
  const us = await user.findOne({ username: data.username }).lean();
  if (!us)
    res.json({ status: "error", error: "user or password are not correct" });
  else {
    if (await bcrypt.compare(data.password, us.password)) {
      const max_age = 3 * 24 * 60 * 60;
      const token = jwt.sign(
        {
          id: us._id,
          username: us.username,
        },
        process.env.jwt_secret,
        { expiresIn: max_age }
      );
      console.log("cookie set --> ", token);
      //,maxAge:max_age*1000
      res.cookie("jwt", token, { httpOnly: true });
      res.cookie("connected", true);

      res.json({ status: "ok", user: us._id });
    } else
      res.json({ status: "error", error: "user or password are not correct" });
  }
});

app.post("/register", requireAuth, async (req, res) => {
  console.log(req.body);
  let data = req.body;
  if (data["password"].length < 6) {
    return res.json({ status: "error", error: "Password must be more than 6" });
  }

  console.log("data --> ", data);
  const hashed_pwd = await bcrypt.hash(data["password"], 10);
  data["password"] = hashed_pwd;
  console.log("hashed pwd --> ", data);

  try {
    const response = await user.create(data);
    console.log(response);
  } catch (error) {
    console.log(error);
    res.json({ status: error });
  }
});

app.post("/verify", (req, res) => {
  const token = req.cookies.jwt;
  console.log("Cookies: ", req.cookies);

  if (token) {
    jwt.verify(token, process.env.jwt_secret, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.send({ logedin: 0 });
      } else {
        console.log("decodedToken : ", decodedToken);
        res.send({ logedin: 1 });
      }
    });
  } else {
    res.send({ logedin: 0 });
  }
});

app.post("/disconnect", requireAuth, (req, res) => {
  res.clearCookie("jwt");
  res.clearCookie("connected");
  res.end();
});

function explode_obj(arr) {
  var i = 0;
  arr?.map((elt) => {
    arr[i] = { ...elt, ...elt.dep[0], ...elt.cd[0], ...elt.cts[0] };
    delete arr[i].dep;
    delete arr[i].cd;
    delete arr[i].cts;
    i++;
  });
  return arr;
}
function change_id(arr,typ) {
  if(typ=='vhcd'){
  arr?.map((elt) => {
    Object.defineProperty(
      elt,
      "id",
      Object.getOwnPropertyDescriptor(elt, "sous_contrat")
    );
    delete elt["sous_contrat"];
  });
  return arr;}
  else{
    arr?.map((elt) => {
      Object.defineProperty(
        elt,
        "id",
        Object.getOwnPropertyDescriptor(elt, "_id")
      );
      delete elt["_id"];
    });
    return arr;

  }
}
function remove_dups(srch_rs) {
  let uniques = [];
  while (srch_rs.length > 0) {
    uniques.push(srch_rs[0]);
    srch_rs = srch_rs.filter((elt) => {
      elt.id == srch_rs[0].id;
    });
    console.log(srch_rs.length);
  }

  return uniques;
}
app.post("/search", async (req, res) => {
  var cd = await conducteur.aggregate([
    { $match: { $text: { $search: req.body.search } } },
    {
      $lookup: {
        from: "sous_contrats",
        localField: "sous_contrat",
        foreignField: "_id",
        as: "dep",
      },
    },
    {
      $lookup: {
        from: "vehicules",
        localField: "sous_contrat",
        foreignField: "sous_contrat",
        as: "cd",
      },
    },
    {
      $lookup: {
        from: "contrats",
        localField: "sous_contrat",
        foreignField: "sous_contrats",
        as: "cts",
      },
    },
  ]);
  cd = change_id(cd,'vhcd');
  cd = explode_obj(cd);

  var vh = await vehicule.aggregate([
    { $match: { $text: { $search: req.body.search } } },
    {
      $lookup: {
        from: "sous_contrats",
        localField: "sous_contrat",
        foreignField: "_id",
        as: "dep",
      },
    },
    {
      $lookup: {
        from: "conducteurs",
        localField: "sous_contrat",
        foreignField: "sous_contrat",
        as: "cd",
      },
    },
    {
      $lookup: {
        from: "contrats",
        localField: "sous_contrat",
        foreignField: "sous_contrats",
        as: "cts",
      },
    },
  ]);
  vh = change_id(vh,'vhcd'); //non unique id problem
  vh = explode_obj(vh); //when editing it gets edited auto on duplicate row
  var aux = cd.concat(vh); //non unique id

  var sc = await scontrat.aggregate([
    { $match: { $text: { $search: req.body.search } } },
    {
      $lookup: {
        from: "conducteurs",
        localField: "_id",
        foreignField: "sous_contrat",
        as: "dep",
      },
    },
    {
      $lookup: {
        from: "vehicules",
        localField: "_id",
        foreignField: "sous_contrat",
        as: "cd",
      },
    },
    {
      $lookup: {
        from: "contrats",
        localField: "_id",
        foreignField: "sous_contrats",
        as: "cts",
      },
    },
  ]);
  console.log('sous ->->->',sc)
  sc = change_id(sc,'sc');
  sc = explode_obj(sc);
  aux=aux.concat(sc);
  var ct = await contrat.aggregate([
    { $match: { $text: { $search: req.body.search } } },
    {
      $lookup: {
        from: "sous_contrats",
        localField: "sous_contrats",
        foreignField: "_id",
        as: "dep",
      },
    },
    {
      $lookup: {
        from: "vehicules",
        localField: "sous_contrats",
        foreignField: "sous_contrat",
        as: "cd",
      },
    },
    {
      $lookup: {
        from: "conducteurs",
        localField: "sous_contrats",
        foreignField: "sous_contrats",
        as: "cts",
      },
    },
  ]);
  ct = change_id(ct,'sc');
  cd = explode_obj(ct);
  aux=aux.concat(ct);

  res.send(remove_dups(aux));
 });


app.listen(3001, () => {
  console.log("server is working on port 3001");
});
