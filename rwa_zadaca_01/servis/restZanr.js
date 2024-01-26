const ZanrDAO = require("./zanrDAO.js");
const aut = require("./autentifikacija.js");

exports.getZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    
    let zdao = new ZanrDAO();

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    zdao.dajSve().then((zanrovi) => {
        odgovor.send(JSON.stringify(zanrovi));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.postZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    
    let podaci = zahtjev.body;
    let zdao = new ZanrDAO();

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    zdao.dodaj(podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.deleteZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    
    let podaci = zahtjev.body;
    let zdao = new ZanrDAO();

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    zdao.brisiSve().then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.getZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    
    let zdao = new ZanrDAO();
    let id = zahtjev.params.id;

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    zdao.daj(id).then((zanr) => {
        console.log(zanr);
        odgovor.send(JSON.stringify(zanr));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.putZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    
    let id = zahtjev.params.id;
    let podaci = zahtjev.body;
    let zdao = new ZanrDAO();

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    zdao.azuriraj(podaci, id).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}

exports.deleteZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    
    let id = zahtjev.params.id;
    let zdao = new ZanrDAO();

    if (!aut.autentificiraj(zahtjev.query.korime, zahtjev.query.lozinka, zahtjev, odgovor)) return;

    zdao.brisiOdredeni(id).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    }).catch((greska) => {
        odgovor.json(greska);
    });
}