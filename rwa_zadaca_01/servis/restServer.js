const konst         = require("../konstante.js");
const express       = require(konst.dirModula + 'express');
const server        = express();
const Konfiguracija = require("../konfiguracija.js");
const ds            = require("fs/promises");
const restGreske    = require("./restGreske.js");
const cors          = require(konst.dirModula+'cors');

let konf = new Konfiguracija();

server.use(cors());

konf.ucitajKonfiguraciju(true).then(pokreniServer).catch((greska) => {
    console.log(konf.dajKonf());
    
    if (process.argv.length == 2) console.error("Potrebno unijeti naziv datoteke!");
    else if (greska.path)         console.error("Krivi naziv datoteke: " + greska.path);
    else                          console.error(greska);
    
    process.exit();
});

function PripremiPutanjeKorisnik() {
    const restKorisnik  = require("./restKorisnik.js");

    server.get   ("/api/korisnici", restKorisnik.getKorisnici);
    server.post  ("/api/korisnici", restKorisnik.postKorisnici);
    server.put   ("/api/korisnici", restGreske.nijeImplementirano501);
    server.delete("/api/korisnici", restGreske.nijeImplementirano501);

    server.get   ("/api/korisnici/:korime", restKorisnik.getKorisnik);
    server.post  ("/api/korisnici/:korime", restGreske.nijeDopusteno405);
    server.put   ("/api/korisnici/:korime", restKorisnik.putKorisnik);
    server.delete("/api/korisnici/:korime", restGreske.nijeImplementirano501);
    
    server.get   ("/api/korisnici/:korime/prijava", restGreske.nijeImplementirano501);
    server.post  ("/api/korisnici/:korime/prijava", restKorisnik.postKorisnikPrijava);
    server.put   ("/api/korisnici/:korime/prijava", restGreske.nijeImplementirano501);
    server.delete("/api/korisnici/:korime/prijava", restGreske.nijeImplementirano501);

    server.get   ("/api/korisnici/:korime/aktivacija", restGreske.nijeImplementirano501);
    server.post  ("/api/korisnici/:korime/aktivacija", restGreske.nijeDopusteno405);
    server.put   ("/api/korisnici/:korime/aktivacija", restKorisnik.putKorisnikAktivacija);
    server.delete("/api/korisnici/:korime/aktivacija", restGreske.nijeImplementirano501);
}

function PripremiPutanjeFilmovi() {
    const restFilm = require("./restFilm.js");

    server.get   ("/api/filmovi", restFilm.getFilmovi);
    server.post  ("/api/filmovi", restFilm.postFilmovi);
    server.put   ("/api/filmovi", restGreske.nijeImplementirano501);
    server.delete("/api/filmovi", restGreske.nijeImplementirano501);
    
    server.get   ("/api/filmovi/:id", restFilm.getFilm);
    server.post  ("/api/filmovi/:id", restGreske.nijeDopusteno405);
    server.put   ("/api/filmovi/:id", restFilm.putFilm);
    server.delete("/api/filmovi/:id", restFilm.deleteFilm);
}

function PripremiPutanjeZanrovi() {
    const restZanr = require("./restZanr.js");

    server.get   ("/api/zanr", restZanr.getZanrovi);
    server.post  ("/api/zanr", restZanr.postZanrovi);
    server.put   ("/api/zanr", restGreske.nijeImplementirano501);
    server.delete("/api/zanr", restZanr.deleteZanrovi);

    server.get   ("/api/zanr/:id", restZanr.getZanr);
    server.post  ("/api/zanr/:id", restGreske.nijeDopusteno405);
    server.put   ("/api/zanr/:id", restZanr.putZanr);
    server.delete("/api/zanr/:id", restZanr.deleteZanr);
}

function pripremiPutanjeTMDB() {
    const RestTMDB = require("./restTMDB.js");
    let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);
    
    server.get   ("/api/tmdb/zanr", restTMDB.getZanr.bind(restTMDB));
    server.post  ("/api/tmdb/zanr", restGreske.nijeImplementirano501);
    server.put   ("/api/tmdb/zanr", restGreske.nijeImplementirano501);
    server.delete("/api/tmdb/zanr", restGreske.nijeImplementirano501);

    server.get   ("/api/tmdb/filmovi", restTMDB.getFilmovi.bind(restTMDB));
    server.post  ("/api/tmdb/filmovi", restGreske.nijeImplementirano501);
    server.put   ("/api/tmdb/filmovi", restGreske.nijeImplementirano501);
    server.delete("/api/tmdb/filmovi", restGreske.nijeImplementirano501);
}

function pokreniServer() {
    let port = konf.dajKonf()["rest.port"];

    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    
    console.log(konf.dajKonf());

    PripremiPutanjeKorisnik();
    PripremiPutanjeFilmovi();
    PripremiPutanjeZanrovi();
    pripremiPutanjeTMDB();

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        let poruka = { greska: "Stranica nije pronadena" };
        odgovor.json(poruka);
    });

    server.listen(port, () => {
        console.log(`REST Server pokrenut na portu: ${port}`);
    });
}
