const Baza = require("./baza.js");

class ZanrDAO {
	async dajSve() {    
		let baza = new Baza();
		baza.spojiSeNaBazu();
		let sql = `SELECT * FROM zanrovi`
		var podaci = await baza.izvrsiUpit(sql, []).catch((greska) => {console.log(greska)});
		baza.zatvoriVezu();
		
		return podaci;
	}

	async daj(id) {
		let baza = new Baza();
		baza.spojiSeNaBazu();
		let sql = `SELECT * FROM zanrovi WHERE id=?`;
		var podaci = await baza.izvrsiUpit(sql, [id]);
		baza.zatvoriVezu();
		
		if (podaci.length == 1) {
			return podaci[0];
		} else {
			return null;
		}
	}

	async dodaj(zanr) {
		let baza = new Baza();
		baza.spojiSeNaBazu();
		let sql = `INSERT INTO zanrovi (naziv, opis, tmdb_id) VALUES (?,?,?)`;
		let podaci = [zanr.name, null, zanr.id];
		
		await baza.izvrsiUpit(sql, podaci).catch(greska => console.log(greska));
		baza.zatvoriVezu();
		
		return true;
	}

	async azuriraj(zanr, id) {
		let baza = new Baza();
		let sql, podaci;
		baza.spojiSeNaBazu();

        sql = `UPDATE zanrovi SET naziv=?, opis=? WHERE id=?`;
        podaci = [zanr.naziv, zanr.opis, id];

		await baza.izvrsiUpit(sql, podaci);
		baza.zatvoriVezu();
		
		return true;
	}

    async brisiSve() {
		let baza = new Baza();
		baza.spojiSeNaBazu();

        let sql = `DELETE FROM zanrovi WHERE id NOT IN (SELECT f.zanrovi_id FROM zanrovi_filmova f)`;
		await baza.izvrsiUpit(sql, []);
		baza.zatvoriVezu();
		
		return true;
	}

    async brisiOdredeni(id) {
		let baza = new Baza();
        let podaci = await baza.izvrsiUpit(`SELECT * FROM zanrovi_filmova WHERE zanrovi_id=?`, [id]);
		baza.spojiSeNaBazu();
        
		if (podaci.length > 0) {
            return false;
        }
        
		let sql = `DELETE FROM zanrovi WHERE id=?`;
		await baza.izvrsiUpit(sql, [id]);
		baza.zatvoriVezu();
		
		return true;
	}
}

module.exports = ZanrDAO;