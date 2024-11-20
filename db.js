let sqlite3 = require('sqlite3').verbose();
const dbname = "Notes.db";

let theDB = null;
 
const prepareDB = (dbname) => {
  return new sqlite3.Database(`./DB/${dbname}`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);  
} 

theDB = prepareDB(dbname);
theDB.serialize(() => {
  let sql_notes = `CREATE TABLE IF NOT EXISTS notes (
    note_id INTEGER PRIMARY KEY, 
    note_title TEXT, 
    note_body TEXT) WITHOUT ROWID;`;
      
  theDB.run(sql_notes, [], (err) => {
    if (err) {
      throw "Error creating table notes";         
    }      
  });

  theDB.run("DROP TABLE language", [], (err) => {
    if (err) {
      console.log(err);
    }
  });
  
  // Create and then insert into the language table the text translations for the interface 
  let sql_lang = `CREATE TABLE IF NOT EXISTS language (lang_id VARCHAR PRIMARY KEY, interface TEXT) WITHOUT ROWID;`
  theDB.run(sql_lang, [], (err) => {
    if (err) {
      throw "Error creating table language";
    }
  });  
  

  let statement = theDB.prepare("INSERT INTO language (lang_id, interface) VALUES(?, ?)");
  let interfaceEN = `{ 
    "del": "Delete",
    "edit": "Edit" 
  }`;
  let interfaceCZ = `{ 
    "del": "Smazat",
    "edit": "Opravit" 
  }`;
  statement.run('EN', interfaceEN);
  statement.run('CZ', interfaceCZ);
  statement.finalize();
});


const localize = (lang_id) => {
  // Get the localization JSON object from the language table by the lang_id
}


let dbObj = { 
  theDB  
};

module.exports = dbObj;