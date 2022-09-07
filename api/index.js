//config
const express = require("express");
const bodyParser = require("body-parser");
const sqlite = require("sqlite3").verbose();
const app = express();
const url = require("url");
require('dotenv').config()

console.log(process.env.PORT)
let sql;
const db = new sqlite.Database("../quote.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});
app.use(bodyParser.json());
// on ouvre :3000/quote aux requêtes post
app.post("/api/quote", (req, res) => {
  try {
    const { movie, quote, character } = req.body; // on destructure la requête
    sql = `INSERT INTO quote(movie,quote,character) VALUES(?,?,?)`;
    db.run(sql, [movie, quote, character], (err) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      // return res.json({status : 200, success:true})
      console.log("success", movie, quote, character);
    });
    res.json({
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});
// get
app.get("/api/quote", (req, res) => {
  sql = "SELECT * FROM quote"; // requête qui va récupérer toutes la bdd
  try {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject); // on guette l'url pour voir si elle contient des query
    if (queryObject.field && queryObject.type)
      sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`; // si il y a des query on rajoute un paramètre de requête à sql pour chercher précisemment dans la bdd la row qui correspond aux query !!! attention aux espaces !!!
    console.log(sql);
    db.all(sql, [], (err, rows) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 300, success: false, error: "No match" });

      return res.json({ status: 200, data: rows, succes: true });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});
let port
process.env.PORT ? port= process.env.PORT : port = 'https://api-node-sql.vercel.app/'

app.listen(port, console.log(`server listen on port ${port}`));
