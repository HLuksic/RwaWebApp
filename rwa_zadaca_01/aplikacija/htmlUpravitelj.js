const ds   = require("fs/promises");
const jwt  = require("./moduli/jwt.js")
const totp = require("./moduli/totp.js")
const Aut  = require("./autentifikacija.js")
let auth   = new Aut();

exports.pocetna = async function (zahtjev, odgovor) {
    let pocetna = await ucitajStranicu("pocetna", "/html/", zahtjev)
    odgovor.send(pocetna);
}

exports.registracija = async function (zahtjev, odgovor) {
    let greska = "";
    
    if (zahtjev.method == "POST") {
        let uspjeh = await auth.dodajKorisnika(zahtjev.body);
        if (uspjeh) {
            odgovor.redirect("/");
            return;
        } else {
            greska = "Dodavanje nije uspjelo, provjerite podatke!";
        }
    }

    odgovor.redirect("/");
}

exports.odjava = async function (zahtjev, odgovor) {
    zahtjev.session.destroy();
    odgovor.redirect("/");
};

exports.prijava = async function (zahtjev, odgovor) {
    let greska = ""
    if (zahtjev.method == "POST") {
        var korime = zahtjev.body.korime;
        var lozinka = zahtjev.body.lozinka;
        var korisnik = await auth.prijaviKorisnika(korime, lozinka);
        
        if (korisnik) {
            if (JSON.parse(korisnik)["uloga"] == 3) {
                greska = "Korisnik nije aktiviran!"        
            }
            else {
                let totpKljuc = JSON.parse(korisnik)["totp_kljuc"];
                let totpKod = zahtjev.body.totp;
                if (!totp.provjeriTOTP(totpKod, totpKljuc)) {
                    greska = "TOTP nije dobar!"
                } 
                else {
                    zahtjev.session.jwt = jwt.kreirajToken(korisnik)
                    zahtjev.session.korisnik = JSON.parse(korisnik)["ime"] + " " + JSON.parse(korisnik)["prezime"];
                    zahtjev.session.korime = JSON.parse(korisnik)["korime"];
                    zahtjev.session.uloga = JSON.parse(korisnik)["uloga"];
                    odgovor.redirect("/");
                    return;
                }
            }
        } 
        else {
            greska = "Netočni podaci!";
            odgovor.sendStatus(401);
        }
    }

    // let stranica = await ucitajStranicu("prijava", "/html/", zahtjev, greska);
    // odgovor.send(stranica);
}

exports.filmoviPretrazivanje = async function (zahtjev, odgovor) {
    if (zahtjev.session.uloga != 2 && zahtjev.session.uloga != 1) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        let stranica = await ucitajStranicu("filmovi_pretrazivanje", "/html/", zahtjev);
        odgovor.send(stranica);
    }
}

exports.filmoviPregled = async function (zahtjev, odgovor) {
    if (zahtjev.session.uloga != 2 && zahtjev.session.uloga != 1) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        let stranica = await ucitajStranicu("filmovi_pregled", "/html/", zahtjev);
        odgovor.send(stranica);
    }
}

exports.filmoviPrijedlozi = async function (zahtjev, odgovor) {
    if (zahtjev.session.uloga != 1) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        let stranica = await ucitajStranicu("filmovi_prijedlozi", "/html/", zahtjev);
        odgovor.send(stranica);
    }
}

exports.zanrovi = async function (zahtjev, odgovor) {
    if (zahtjev.session.uloga != 1) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        let stranica = await ucitajStranicu("zanrovi", "/html/", zahtjev);
        odgovor.send(stranica);
    }
}

exports.dokumentacija = async function (zahtjev, odgovor) {
    let stranica = await ucitajStranicu("dokumentacija", "/../dokumentacija/", zahtjev);
    odgovor.send(stranica);
}

exports.profil = async function (zahtjev, odgovor) {
    if (zahtjev.session.uloga != 2 && zahtjev.session.uloga != 1) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        let stranica = await ucitajStranicu("profil", "/html/", zahtjev);
        odgovor.send(stranica);
    }
}

exports.korisnici = async function (zahtjev, odgovor) {
    if (zahtjev.session.uloga != 1) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        let stranica = await ucitajStranicu("korisnici", "/html/", zahtjev);
        odgovor.send(stranica);
    }
}

exports.film = async function (zahtjev, odgovor) {
    if (zahtjev.session.uloga != 2 && zahtjev.session.uloga != 1) {
        odgovor.status(401);
        odgovor.json({ greska: "Neautorizirani pristup" });
    }
    else {
        zahtjev.session.filmId = zahtjev.query.id;
        let stranica = await ucitajStranicu("film", "/html/", zahtjev);
        odgovor.send(stranica);
    }
}

async function ucitajStranicu(nazivStranice, folder, zahtjev, poruka = "") {
    let stranice = [ucitajHTML(nazivStranice, folder)];
    
    if (zahtjev.session.uloga == 1) {
        stranice.push(ucitajHTML("navigacija_admin", "/html/"));
    } 
    else if (zahtjev.session.uloga == 2) {
        stranice.push(ucitajHTML("navigacija_korisnik", "/html/"));
    } 
    else {
        stranice.push(ucitajHTML("navigacija_gost", "/html/"));
    }
    let [stranica, nav] = await Promise.all(stranice);
    
    stranica = stranica.replace("#navigacija#", nav);
    stranica = stranica.replace("#poruka#", poruka)
    
    return stranica;
}

function ucitajHTML(htmlStranica, folder) {
    return ds.readFile(__dirname + folder + htmlStranica + ".html", "UTF-8");
}