const KorisnikDAO = require("./korisnikDAO.js");
const restGreske = require("./restGreske.js");
const aut = require("./autentifikacija.js");

exports.getKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json");

    let kdao = new KorisnikDAO();

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    kdao.dajSve().then((korisnici) => {
        odgovor.send(JSON.stringify(korisnici));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.postKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json");

    let kdao = new KorisnikDAO();
    let podaci = zahtjev.body;

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    kdao.dodaj(podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.getKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json");

    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    kdao.daj(korime).then((korisnik) => {
        odgovor.send(JSON.stringify(korisnik));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.putKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json");

    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    let podaci = zahtjev.body;

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;
    kdao.azuriraj(korime, podaci, false).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.putKorisnikAktivacija = async function (zahtjev, odgovor) {
    odgovor.type("application/json");

    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    let kod = zahtjev.body.aktivacijskiKod;

    let korisnik = await kdao.daj(korime);

    if (korisnik.aktivacijski_kljuc == 0) {
        odgovor.status = 401;
        odgovor.send({ greska: "Aktivacijski kod je već iskorišten!" });
    }
    else if (kod == korisnik.aktivacijski_kljuc) {
        kdao.azuriraj(korime, [], true).then(() => {
            odgovor.json(JSON.stringify("Aktivacija uspješna, možete zatvoriti karticu!"));
        }).catch(greska => console.log(greska));
    }
    else {
        odgovor.status = 401;
        odgovor.send({ greska: "Netočan aktivacijski kod!" });
    }
}

exports.postKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json");

    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    kdao.daj(korime).then((korisnik) => {
        if (korisnik != null && korisnik.lozinka == zahtjev.body.lozinka) {
            odgovor.send(JSON.stringify(korisnik));
        }
        else {
            restGreske.neautoriziraniPristup401(zahtjev, odgovor);
        }
    }).catch((greska) => {
        odgovor.json(greska);
    });
}