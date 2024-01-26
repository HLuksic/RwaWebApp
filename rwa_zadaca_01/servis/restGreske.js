exports.nevaljaliZahtjev400 = function (zahtjev, odgovor) {
    odgovor.status(400);
    odgovor.send({ greska: "Nevaljali zahtjev!" });
}

exports.neautoriziraniPristup401 = function (zahtjev, odgovor) {
    odgovor.status(401);
    odgovor.send({ greska: "Neautorizirani pristup!" });
}

exports.nijeDopusteno405 = function (zahtjev, odgovor) {
    odgovor.status(405);
    odgovor.send({ greska: "Metoda nije dopuštena!" });
}

exports.neocekivaniPodaci417 = function (zahtjev, odgovor) {
    odgovor.status(417);
    odgovor.send({ greska: "Neočekivani podaci!" });
}

exports.nijeImplementirano501 = function (zahtjev, odgovor) {
    odgovor.status(501);
    odgovor.send({ greska: "Metoda nije implementirana!" });
}


