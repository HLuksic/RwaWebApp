const ds = require("fs/promises");

class Konfiguracija {
    constructor() { this.konf = {}; }
    dajKonf() { return this.konf; }

    async ucitajKonfiguraciju(rest) {
        var podaci = await ds.readFile(process.argv[2], "UTF-8");
        this.konf = pretvoriJSONkonfig(podaci);
        
        provjeriTocnost(this.konf, rest);
    }
}

function pretvoriJSONkonfig(podaci) {
    let konf = {};
    var nizPodataka = podaci.split("\n");
    for (let podatak of nizPodataka) {
        var podatakNiz = podatak.split("=");
        var naziv = podatakNiz[0];
        var vrijednost = podatakNiz[1];
        konf[naziv] = vrijednost;
    }
    return konf;
}

function provjeriTocnost(podaci, rest) {
    const regexKorime  = new RegExp(/^(?=(.*\d){2,})(?=.*[a-zA-Z]{2,})[0-9a-zA-Z]{15,20}$/g);
    const regexLozinka = new RegExp(/^(?=(.*\d){3,})(?=.*[a-zA-Z]{3,})(?=.*[^A-Za-z\d]{3,}).{20,100}$/g);
    const brojStranica = podaci["app.broj.stranica"];
    const korime       = podaci["rest.korime"];
    const lozinka      = podaci["rest.lozinka"];

    if (!korime)                     throw("REST korisničko ime nije uneseno!");
    if (!lozinka)                    throw("REST lozinka nije unesena!");
    if (!regexKorime.test(korime))   throw("REST korisničko ime je u krivom formatu: dopuštena samo slova (min. 2), brojevi (min. 2), 15-20 znakova!");
    if (!regexLozinka.test(lozinka)) throw("REST lozinka je u krivom formatu: dopušteni svi znakovi, min. 3 slova, 3 broja, 3 posebna znaka, 20-100 znakova!");

    if (rest) {
        if (!podaci["tmdb.apikey.v3"]) throw("API ključ v3 nije unesen!");
        if (!podaci["tmdb.apikey.v4"]) throw("API ključ v4 nije unesen!");
    }
    else {
        if (!brojStranica)                          throw("Broj stranica nije unesen!");
        if (brojStranica < 5 || brojStranica > 100) throw("Broj stranica izvan raspona (5-100)!");
    }
}

module.exports = Konfiguracija;