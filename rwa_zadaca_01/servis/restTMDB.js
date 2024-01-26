const TMDBklijent = require("./klijentTMDB.js");
const restGreske = require("./restGreske.js");
const aut = require("./autentifikacija.js");

class RestTMDB {

    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
    }

    getZanr(zahtjev, odgovor) {
        this.tmdbKlijent.dohvatiZanrove().then((zanrovi) => {
            odgovor.type("application/json");
            odgovor.send(zanrovi);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }

    getFilmovi(zahtjev, odgovor) {
        odgovor.type("application/json");
        
        let stranica = zahtjev.query.stranica;
        let rijeci = zahtjev.query.kljucnaRijec;

        if (stranica == null || rijeci == null) {
            restGreske.neocekivaniPodaci417(zahtjev, odgovor);
            return;
        }

        this.tmdbKlijent.pretraziFilmove(rijeci, stranica).then((filmovi) => {
            odgovor.send(filmovi);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }
}

module.exports = RestTMDB;