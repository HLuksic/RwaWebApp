const Konfiguracija = require("../konfiguracija.js");
const restGreske = require("./restGreske.js");
let konf = new Konfiguracija();

konf.ucitajKonfiguraciju(true);

exports.autentificiraj = function (korime, lozinka, zahtjev, odgovor) {
    // if (!korime || !lozinka) {
    //     console.log("Krivi podaci!");
    //     restGreske.nevaljaliZahtjev400(zahtjev, odgovor);
    //     return false;
    // }
    // else if (korime != konf.dajKonf()["rest.korime"] || lozinka != konf.dajKonf()["rest.lozinka"]) {
    //     restGreske.neautoriziraniPristup401(zahtjev, odgovor);
    //     return false;
    // }
    return true;
}