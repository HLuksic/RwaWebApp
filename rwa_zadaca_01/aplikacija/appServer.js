const konst           = require("../konstante.js");
const express         = require(konst.dirModula + 'express');
const sesija          = require(konst.dirModula + 'express-session')
const kolacici        = require(konst.dirModula + 'cookie-parser')
const server          = express();
const Konfiguracija   = require("../konfiguracija.js");
const htmlUpravitelj  = require("./htmlUpravitelj.js");
const fetchUpravitelj = require("./fetchUpravitelj.js");
const cors            = require(konst.dirModula+'cors');
const path            = require('path');

let konf = new Konfiguracija();

server.use(cors());

konf.ucitajKonfiguraciju(false).then(pokreniServer).catch((greska) => {
    console.log(konf.dajKonf());
    
    if (process.argv.length == 2) console.error("Potrebno unijeti naziv datoteke!");
    else if (greska.path)         console.error("Krivi naziv datoteke: " + greska.path);
    else                          console.error(greska);
    
    process.exit();
});

function pripremiPutanjePocetna() {
    server.get('/*', (zahtjev, odgovor) => odgovor.sendFile(path.join(__dirname)));
    server.get('/dajSveZanrove', fetchUpravitelj.dajSveZanrove);
    server.get('/dajDvaFilma',   fetchUpravitelj.dajDvaFilma);
    server.get('/dokumentacija', htmlUpravitelj.dokumentacija);
}

function pripremiPutanjeFilmovi() {
    server.get    ('/filmoviPretrazivanje', htmlUpravitelj.filmoviPretrazivanje);
    server.post   ('/filmoviPretrazivanje', fetchUpravitelj.filmoviPretrazivanje);
    server.get    ('/filmoviPrijedlozi',    htmlUpravitelj.filmoviPrijedlozi);
    server.get    ('/filmoviPregled',       htmlUpravitelj.filmoviPregled);
    server.post   ('/filmoviPregled',       fetchUpravitelj.filmoviPregled);
    server.get    ('/film',                 htmlUpravitelj.film);
    server.post   ('/film',                 fetchUpravitelj.dajFilm);
    server.delete ('/film',                 fetchUpravitelj.brisiFilm);
    server.post   ('/dodajFilm',            fetchUpravitelj.dodajFilm);
    server.put    ('/azurirajFilm',         fetchUpravitelj.azurirajFilm);
    server.get    ('/zanrovi',              htmlUpravitelj.zanrovi);
    server.get    ('/dodajZanrove',         fetchUpravitelj.dodajZanrove);
}

function pripremiPutanjeAutentifikacija() {
    server.get ("/registracija", htmlUpravitelj.registracija);
    server.post("/registracija", htmlUpravitelj.registracija);
    server.get ("/odjava",       htmlUpravitelj.odjava);
    server.get ("/prijava",      htmlUpravitelj.prijava);
    server.post("/prijava",      htmlUpravitelj.prijava);
    server.get ("/getJWT",       fetchUpravitelj.getJWT);
    server.get ("/aktivacija",   fetchUpravitelj.aktivacijaRacuna);
}

function pripremiPutanjeProfil() {
    server.get  ("/profil",    htmlUpravitelj.profil);
    server.post ("/profil",    fetchUpravitelj.dajKorisnika);
    server.put  ("/profil",    fetchUpravitelj.dajKorisnika);
    server.get  ("/korisnici", htmlUpravitelj.korisnici);
    server.post ("/korisnici", fetchUpravitelj.dajSveKorisnike);
    server.put  ("/korisnici", fetchUpravitelj.azurirajKorisnika);
}

async function restTest() {
    let portRest = konf.dajKonf()["rest.port"];

    console.log("Testiram REST server...");

    let korime  = konf.dajKonf()["rest.korime"];
    let lozinka = konf.dajKonf()["rest.lozinka"];
    
    let o = await fetch("http://localhost:" + portRest + "/api/zanr?korime=" + korime + "&lozinka=" + lozinka).catch((greska) => {
        console.error(greska);
        process.exit();
    });
    
    if (o.status == 400) console.error("Nevaljali zahtjev, gasim!");
    if (o.status == 401) console.error("Netočni podaci, gasim!");
    if (!o.ok)           process.exit();

    console.log("Komunikacija s REST serverom uspješna!");
}

async function pokreniServer() {
    let port = konf.dajKonf()["app.port"];

    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    server.use(kolacici());
    
    server.use(sesija({
        secret: konst.tajniKljucSesija, 
        saveUninitialized: true,
        cookie: {  maxAge: 1000 * 60 * 60 * 3 },
        resave: false
    }));
    
    console.log(konf.dajKonf());
    
    await restTest();
    pripremiPutanjePocetna();
    pripremiPutanjeAutentifikacija();
    pripremiPutanjeFilmovi();
    pripremiPutanjeProfil();
    
    // serve angular app on root
    // server.use("/js", express.static(__dirname + "/js"));
    server.use(express.static(__dirname + "/angular"));
    server.use(express.static(__dirname + "/../dokumentacija"));
    server.use(express.static(__dirname + "/../css"));

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        var poruka = { greska: "Stranica nije pronađena!" };
        odgovor.send(JSON.stringify(poruka));
    });
    
    server.listen(port, () => {
        console.log(`App Server pokrenut na portu: ${port}`);
    });
}