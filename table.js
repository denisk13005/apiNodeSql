// on crée ce fichier pour créer la bdd et la table en lançant les requête de à l'intérieur de celui ci
const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database("./quote.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});

const sql = `CREATE TABLE quote(ID INTEGER PRIMARY KEY,movie,quote,character)`; //on crée la requête de création de la table
db.run(sql); // on lance la requête
