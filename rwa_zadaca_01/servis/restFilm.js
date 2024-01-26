const FilmDAO = require("./filmDAO.js");
const restGreske = require("./restGreske.js");
const aut = require("./autentifikacija.js");

exports.getFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let fdao = new FilmDAO();

    const brojStranice = Number(zahtjev.query.stranica);
    const brojFilmova  = Number(zahtjev.query.brojFilmova);
    
    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;
    
    if (!brojStranice || !brojFilmova) {
        restGreske.neocekivaniPodaci417(zahtjev, odgovor);
        return;
    }

    const datum     = zahtjev.query.datum;
    const zanr      = Number(zahtjev.query.zanr);
    const naziv     = zahtjev.query.naziv;
    const sort      = zahtjev.query.sortiraj;
    const traziOdob = zahtjev.query.traziOdobrene;
    
    fdao.pretrazi(brojStranice, brojFilmova, datum, zanr, naziv, sort, traziOdob).then((filmovi) => {
        // console.log(filmovi);
        odgovor.send(JSON.stringify(filmovi));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.getFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    
    let fdao = new FilmDAO();
    let id = zahtjev.params.id;

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;
    
    fdao.daj(id).then((film) => {
        // console.log(film);
        odgovor.send(JSON.stringify(film));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.putFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    
    let fdao = new FilmDAO();
    let id = zahtjev.params.id;
    let podaci = zahtjev.body;

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    fdao.azuriraj(id, podaci).then((film) => {
        odgovor.send(JSON.stringify(film));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.deleteFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    
    let fdao = new FilmDAO();
    let id = zahtjev.params.id;

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    fdao.brisi(id).then((film) => {
        // console.log(film);
        odgovor.send(JSON.stringify(film));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.postFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    
    let fdao = new FilmDAO();
    let film = zahtjev.body;

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    fdao.dodaj(film).then(() => {
        odgovor.send( { OK : "OK" });
    }).catch((greska) => {
        odgovor.json(greska);
    });
}