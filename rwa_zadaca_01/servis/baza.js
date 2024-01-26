const konst = require("../konstante.js");
const sqlite3 = require('sqlite3').verbose();
const ds = require("fs");

class Baza {

    constructor() {
        this.db = null;
    }

    spojiSeNaBazu() {
        this.db = new sqlite3.Database('../../baza.sqlite', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    izvrsiUpit(sql, podaciZaSQL) {
        return new Promise((uspjeh, neuspjeh) => {
            this.db.all(sql, podaciZaSQL, (greska, rez) => {
                if (greska) neuspjeh(greska);
                else uspjeh(rez);
            });
        });
    }

    zatvoriVezu() {
        this.db.close();
    }
}

module.exports = Baza;