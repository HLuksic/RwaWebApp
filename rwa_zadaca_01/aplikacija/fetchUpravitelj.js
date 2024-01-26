const FilmoviZanroviKomunikacija = require("./filmoviKomunikacija.js");
const Autentifikacija = require("./autentifikacija.js")
const Konfiguracija = require("../konfiguracija.js")
const jwt = require("./moduli/jwt.js")
let auth = new Autentifikacija();
let fk = new FilmoviZanroviKomunikacija();

let konf = new Konfiguracija();
konf.ucitajKonfiguraciju();

exports.aktivacijaRacuna = async function (zahtjev, odgovor) {
    let korime = zahtjev.query.korime;
    let kod = zahtjev.query.kod;

    let poruka = await auth.aktivirajKorisnickiRacun(korime, kod);

    odgovor.send(await poruka.text());
}

exports.dajSveZanrove = async function (zahtjev, odgovor) {
    odgovor.json(await fk.dohvatiSveZanrove());
}

exports.dodajZanrove = async function (zahtjev, odgovor) {
    let zanroviBaza = await fk.dohvatiSveZanrove();
    if (zanroviBaza.length == 0) {
        let zanrovi = await fk.dohvatiSveZanroveTMDB();
        for (const zanr of zanrovi.genres) {
            await fk.dodajZanrUbazu(zanr);
        }
        odgovor.status(200);
        return;
    }
    else {
        odgovor.status(417);
        odgovor.json({ greska: "Zanrovi vec postoje" });
        return;
    }
}

exports.dajDvaFilma = async function (zahtjev, odgovor) {
    odgovor.json(await fk.dohvatiNasumceFilm(zahtjev.query.zanr))
}

exports.dajKorisnika = async function (zahtjev, odgovor) {
    // if (!jwt.provjeriToken(zahtjev)) {
    //     odgovor.status(401);
    //     odgovor.json({ greska: "Neautorizirani pristup" });
    //     return;
    // }
    odgovor.json(await auth.dajKorisnika(zahtjev.session.korime));
}

exports.dajSveKorisnike = async function (zahtjev, odgovor) {
    // if (!jwt.provjeriToken(zahtjev) || zahtjev.session.uloga != 1) {
    //     odgovor.status(401);
    //     odgovor.json({ greska: "Neautorizirani pristup" });
    //     return;
    // }

    odgovor.json(await fk.dohvatiSveKorisnike());
}

exports.azurirajKorisnika = async function (zahtjev, odgovor) {
    odgovor.type('application/json');

    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        odgovor.json(await fk.azurirajKorisnika(zahtjev.body));
    }
}

exports.getJWT = async function (zahtjev, odgovor) {
    if (zahtjev.session.jwt != null) {
        let k = { korime: jwt.dajTijelo(zahtjev.session.jwt).korime };
        let noviToken = jwt.kreirajToken(k)
        odgovor.send({ ok: noviToken });
        return;
    }
    // odgovor.status(401);
    // odgovor.send({ greska: "nemam token!" });
}

exports.filmoviPretrazivanje = async function (zahtjev, odgovor) {
    odgovor.type('application/json');

    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        let str = zahtjev.query.str;
        let filter = zahtjev.query.filter;
        odgovor.json(await fk.dohvatiFilmove(str, filter));
    }
}

exports.dajFilm = async function (zahtjev, odgovor) {
    odgovor.type('application/json');

    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        odgovor.json(await fk.dohvatiFilm(zahtjev.session.filmId));
    }
}

exports.azurirajFilm = async function (zahtjev, odgovor) {
    odgovor.type('application/json');

    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        odgovor.json(await fk.azurirajFilm(zahtjev.body));
    }
}

exports.brisiFilm = async function (zahtjev, odgovor) {
    odgovor.type('application/json');

    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        odgovor.json(await fk.brisiFilm(zahtjev.query.id));
    }
}

exports.filmoviPregled = async function (zahtjev, odgovor) {
    let konf = new Konfiguracija();
    await konf.ucitajKonfiguraciju(false);

    odgovor.type('application/json');

    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        let stranica     = zahtjev.query.stranica;
        let naziv        = zahtjev.query.naziv;
        let datum        = zahtjev.query.datum;
        let zanr         = Number(zahtjev.query.zanr);
        let sort         = zahtjev.query.sortiraj;
        let traziOdob    = zahtjev.query.traziOdobrene;
        let brojFilmova  = konf.dajKonf()["app.broj.stranica"];
        odgovor.json(await fk.dohvatiFilmoveBaza(stranica, brojFilmova, naziv, datum, zanr, sort, traziOdob));
    }
}

exports.dodajFilm = async function (zahtjev, odgovor) {
    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
        odgovor.send();
        return;
    }

    // let zanroviBaza = await fk.dohvatiSveZanrove();
    // let film = zahtjev.body;
    
    odgovor.json(await fk.dodajFilmUbazu(zahtjev.body));
}
