const Baza = require("./baza.js");

class KorisnikDAO {
	async dajSve() {
		let baza = new Baza();
		baza.spojiSeNaBazu();
		let sql = `SELECT * FROM korisnici;`
		var podaci = await baza.izvrsiUpit(sql, []);
		baza.zatvoriVezu();

		return podaci;
	}

	async daj(korime) {
		let baza = new Baza();
		baza.spojiSeNaBazu();
		let sql = `SELECT * FROM korisnici WHERE korime=?`;
		var podaci = await baza.izvrsiUpit(sql, [korime]);
		
		baza.zatvoriVezu();
		
		if (podaci.length == 1) {
			return podaci[0];
		} else {
			return null;
		}
	}

	async dodaj(korisnik) {
		let baza = new Baza();
		baza.spojiSeNaBazu();
		
		let sql = `INSERT INTO korisnici (korime,lozinka,email,uloga,ime,prezime,datum_rodenja,aktivacijski_kljuc,totp_kljuc) VALUES (?,?,?,?,?,?,?,?,?)`;
		let podaci = [korisnik.korime, korisnik.lozinka, korisnik.email, 2,
			korisnik.ime, korisnik.prezime, korisnik.datum_rodenja, korisnik.aktivacijskiKod, korisnik.TOTPkljuc];
		
		await baza.izvrsiUpit(sql, podaci).catch(error=>console.log(error));
		baza.zatvoriVezu();
		return true;
	}

	async azuriraj(korime, korisnik, aktivacija) {
		let baza = new Baza();
		baza.spojiSeNaBazu();
		let sql, podaci;

		if (aktivacija) {
			sql = `UPDATE korisnici SET uloga=2, aktivacijski_kljuc=0 WHERE korime=?`;
			podaci = [korime];
		} else {
			sql = `UPDATE korisnici SET ime=?, prezime=?, datum_rodenja=?, uloga=? WHERE korime=?`;
			podaci = [korisnik.ime, korisnik.prezime, korisnik.datum_rodenja, korisnik.uloga, korime];
		}
		console.log(korisnik);
		await baza.izvrsiUpit(sql, podaci).catch(greska => console.log(greska));
		baza.zatvoriVezu();
		return true;
	}
}

module.exports = KorisnikDAO;