const konst    = require("../konstante.js");
const kodovi   = require("./moduli/kodovi.js")
const Konf     = require("../konfiguracija.js")
var konf = new Konf();
konf.ucitajKonfiguraciju(false);

const url = "http://localhost:4000/api";

class FilmoviZanroviKomunikacija {
    async dohvatiFilmove(stranica, kljucnaRijec = "") {
        let putanja = url + "/tmdb/filmovi?stranica=" + stranica + "&kljucnaRijec=" + kljucnaRijec;
        let odgovor = await fetch(putanja);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);

        return filmovi;
    }

    async dohvatiFilm(id) {
        let putanja = url + "/filmovi/" + id + "?korime=" + konf.dajKonf()["rest.korime"] 
            + "&lozinka=" + konf.dajKonf()["rest.lozinka"];
        let odgovor = await fetch(putanja);
        let podaci = await odgovor.text();
        let film = JSON.parse(podaci);

        return film;
    }

    async dohvatiFilmoveBaza(stranica, brojFilmova, naziv = "", datum, zanr, sort, traziOdob) {
        let putanja = url + "/filmovi?stranica=" + stranica + "&brojFilmova=" + brojFilmova + "&naziv=" + naziv + 
            "&traziOdobrene=" + traziOdob + "&korime=" + konf.dajKonf()["rest.korime"] + "&lozinka=" + konf.dajKonf()["rest.lozinka"];
        
        let odgovor = await fetch(putanja);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);

        return filmovi;
    }

    async azurirajFilm(film) {
        let odgovor = await fetch(url + "/filmovi/" + film.id + "?korime=" + konf.dajKonf()["rest.korime"] 
            + "&lozinka=" + konf.dajKonf()["rest.lozinka"], 
            { method: 'PUT', body: JSON.stringify(film), headers: { "Content-Type": "application/json" } });

        return odgovor;
    }

    async brisiFilm(filmId) {
        let odgovor = await fetch(url + "/filmovi/" + filmId + "?korime=" + konf.dajKonf()["rest.korime"] 
            + "&lozinka=" + konf.dajKonf()["rest.lozinka"], 
            { method: 'DELETE' });

        return odgovor;
    }

    async dohvatiSveZanrove() {
        let odgovor = await fetch(url + "/zanr?korime=" + konf.dajKonf()["rest.korime"]
             + "&lozinka=" + konf.dajKonf()["rest.lozinka"]);
        let podaci = await odgovor.text();
        let zanrovi = JSON.parse(podaci);
        
        return zanrovi;
    }

    async dohvatiSveKorisnike() {
        let odgovor = await fetch(url + "/korisnici?korime=" + konf.dajKonf()["rest.korime"]
             + "&lozinka=" + konf.dajKonf()["rest.lozinka"]);
        let podaci = await odgovor.text();
        let zanrovi = JSON.parse(podaci);
        
        return zanrovi;
    }

    async dohvatiSveZanroveTMDB() {
        let odgovor = await fetch(url + "/tmdb/zanr");
        let podaci = await odgovor.text();
        let zanrovi = JSON.parse(podaci);
        
        return zanrovi;
    }

    async dohvatiNasumceFilm(zanr) {
        let odgovor = await fetch(url + "/filmovi?stranica=1&brojFilmova=100&traziOdobrene=1&zanr=" + zanr + "&korime=" 
            + konf.dajKonf()["rest.korime"] + "&lozinka=" + konf.dajKonf()["rest.lozinka"]);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);
        let max = Object.keys(filmovi).length;
        let rez = [filmovi[kodovi.dajNasumceBroj(0, max)], filmovi[kodovi.dajNasumceBroj(0, max)]];
        
        return rez;
    }

    async dodajFilmUbazu(film) {
        let odgovor = await fetch(url + "/filmovi?" + "korime=" + konf.dajKonf()["rest.korime"] 
            + "&lozinka=" + konf.dajKonf()["rest.lozinka"], 
            { method: 'POST', body: JSON.stringify(film), headers: { "Content-Type": "application/json" } });

        return odgovor;
    }

    async dodajZanrUbazu(zanr) {
        let odgovor = await fetch(url + "/zanr?" + "korime=" + konf.dajKonf()["rest.korime"] + "&lozinka=" 
            + konf.dajKonf()["rest.lozinka"], 
            { method: 'POST', body: JSON.stringify(zanr), headers: { "Content-Type": "application/json" } });

        return odgovor;
    }

    async azurirajKorisnika(korisnik) {
        console.log(korisnik);
        let odgovor = await fetch(url + "/korisnici/korime/" + korisnik.korime + "?korime=" + konf.dajKonf()["rest.korime"] 
            + "&lozinka=" + konf.dajKonf()["rest.lozinka"], 
            { method: 'PUT', body: JSON.stringify(korisnik), headers: { "Content-Type": "application/json" } });

        return odgovor;
    }
}

module.exports = FilmoviZanroviKomunikacija;