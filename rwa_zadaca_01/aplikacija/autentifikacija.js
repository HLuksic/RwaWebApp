const konst    = require("../konstante.js");
const mail     = require("./moduli/mail.js")
const kodovi   = require("./moduli/kodovi.js")
const totp     = require("./moduli/totp.js")
const Konf     = require("../konfiguracija.js");
const sol      = "kvnoiuernfsdjvdaf"
let konf       = new Konf();

konf.ucitajKonfiguraciju();

const url = "http://localhost:4000/api"

class Autentifikacija {
    portRest = konf.dajKonf()["rest.port"];

    async dajKorisnika(korime) {
        let odgovor = await fetch(url + "/korisnici/" + korime + "?korime=" 
            + konf.dajKonf()["rest.korime"] + "&lozinka=" + konf.dajKonf()["rest.lozinka"]);;
        let podaci = await odgovor.text();
        let korisnik = JSON.parse(podaci);

        return korisnik;
    }

    async dodajKorisnika(korisnik) {
        if (!korisnik.datum) korisnik.datum = null;
        let tijelo = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            lozinka: kodovi.kreirajSHA256(korisnik.lozinka, sol + korisnik.korime),
            email: korisnik.email,
            korime: korisnik.korime,
            datum_rodenja: korisnik.datum
        };

        let aktivacijskiKod = kodovi.dajNasumceBroj(10000, 99999);
        tijelo["aktivacijskiKod"] = aktivacijskiKod;
        let tajniTOTPkljuc = totp.kreirajTajniKljuc(korisnik.korime);
        tijelo["TOTPkljuc"] = tajniTOTPkljuc;

        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        let odgovor = await fetch(url + "/korisnici?korime=" 
            + konf.dajKonf()["rest.korime"] + "&lozinka=" + konf.dajKonf()["rest.lozinka"], parametri);

        if (odgovor.status == 200) {
            console.log("Korisnik ubačen na servisu");
            
            // let mailPoruka = "Aktivacijski kod: " + aktivacijskiKod + "\nhttp://spider.foi.hr:12118/aktivacija?korime=" 
                // + korisnik.korime + "&kod=" + aktivacijskiKod +  "\nTOTP Kljuc: " + tajniTOTPkljuc;
            // let poruka = await mail.posaljiMail("hluksic20@student.foi.hr", korisnik.email, "Filmoteka aktivacijski kod", mailPoruka);
            
            return true;
        }
        else {
            console.log(odgovor.status);
            console.log(await odgovor.text());
            return false;
        }
    }

    // async aktivirajKorisnickiRacun(korime, kod) {
    //     let zaglavlje = new Headers();
    //     zaglavlje.set("Content-Type", "application/json");
    //     let parametri = {
    //         method: 'PUT',
    //         body: JSON.stringify({ aktivacijskiKod: kod }),
    //         headers: zaglavlje
    //     }
        
    //     return await fetch("http://spider.foi.hr:12249/api/korisnici/" + korime + "/aktivacija?korime=" 
    //         + konf.dajKonf()["rest.korime"] + "&lozinka=" + konf.dajKonf()["rest.lozinka"], parametri);
    // }

    async prijaviKorisnika(korime, lozinka) {
        lozinka = kodovi.kreirajSHA256(lozinka, sol + korime);
        
        let tijelo = {
            lozinka: lozinka,
        };
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        
        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        let odgovor = await fetch(url + "/korisnici/" + korime + "/prijava?korime=" 
            + konf.dajKonf()["rest.korime"] + "&lozinka=" + konf.dajKonf()["rest.lozinka"], parametri)

        if (odgovor.status == 200) {
            return await odgovor.text();
        }
        else {
            return false;
        }
    }
}

module.exports = Autentifikacija;