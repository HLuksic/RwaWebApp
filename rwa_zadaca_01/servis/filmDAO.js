const Baza = require("./baza.js");

class FilmDAO {
    async pretrazi(brojStranice, brojFilmova, datum, zanr, naziv, sort, traziOdobrene) {
        let baza = new Baza();
        let sql = `SELECT * FROM filmovi WHERE odobren=?`;
        let filter = [];
        filter.push(traziOdobrene);
        
        if (datum) {
            filter.push(datum);
            sql += `AND datum_dodavanja<=?`;
        }
        
        if (zanr) {
            filter.push(zanr);
            sql += ` AND id IN (SELECT filmovi_id FROM zanrovi_filmova WHERE zanrovi_id=?)`;
        }
        
        if (naziv) {
            filter.push("%" + naziv + "%");
            sql += ` AND naslov LIKE ?`;
        }
        
        if (sort) {
            if (sort == "d") sql += ` ORDER BY datum_dodavanja`; 
            if (sort == "n") sql += ` ORDER BY naslov`;
            // if (sort == "z") sql += ` ORDER BY (SELECT naziv FROM zanrovi where id=?)`;
        }
        
        baza.spojiSeNaBazu();
        let podaci = await baza.izvrsiUpit(sql, filter);
        let ukupnoZapisa = podaci.length;

        if (brojStranice == 1) {
            filter.push(brojFilmova);
            sql += ` LIMIT 0,?`;
        } 
        else {
            filter.push((brojStranice - 1) * brojFilmova);
            filter.push(brojFilmova);
            sql += ` LIMIT ?,?`
        }
        
        podaci = await baza.izvrsiUpit(sql, filter);
        baza.zatvoriVezu();
        return podaci;
    }
    
    async daj(id) {
        let baza = new Baza();
        baza.spojiSeNaBazu();
        let sql = `SELECT * FROM filmovi WHERE id=?`;
        var podaci = await baza.izvrsiUpit(sql, [id]);
        baza.zatvoriVezu();
        
        if (podaci.length == 1)
            return podaci[0];
        else
            return null;
    }

    async dodaj(film) {
        let baza = new Baza();
        let sql = `INSERT INTO filmovi (tmdb_id,imdb_id,tmdb_url,naslov,izvorni_naslov,opis,
            jezik,datum_objave,datum_dodavanja,dodao,odobren,vrijeme_trajanja,budzet,prihod,
            ocjena,broj_ocjena,popularnost,za_odrasle,status,video,tagline,pozadina_url,
            poster_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        
        let sada = (new Date()).toISOString().split('T')[0];
        let podaci = [film.id, film.imdb_id, film.homepage, film.title,
            film.original_title, film.overview, film.original_language, film.release_date,
            sada, /*film.dodao*/5, 0, film.runtime, film.budget,
            film.revenue, film.vote_average, film.vote_count, film.popularity, film.adult,
            film.status, film.video, film.tagline, film.backdrop_path, film.poster_path];
        
        baza.spojiSeNaBazu();
        
        await baza.izvrsiUpit(sql, podaci).catch((greska) => {
            console.log(greska);
        });
        
        for (const zanrTmdbId of film.genre_ids) {
            let filmBazaId = await baza.izvrsiUpit("SELECT id FROM filmovi WHERE tmdb_id=?", [film.id]);
            let zanrBazaId = await baza.izvrsiUpit("SELECT id FROM zanrovi WHERE tmdb_id=?", [zanrTmdbId]);
            filmBazaId = filmBazaId[0]["id"];
            zanrBazaId = zanrBazaId[0]["id"];
            await baza.izvrsiUpit("INSERT INTO zanrovi_filmova (filmovi_id, zanrovi_id) VALUES (?,?)", [filmBazaId, zanrBazaId]).catch(greska=>console.log(greska));
        }

        baza.zatvoriVezu();
        
        return true;
    }

    async azuriraj(id, film) {
        let baza = new Baza();
        let sql = `UPDATE filmovi SET tmdb_id=?,imdb_id=?,tmdb_url=?,naslov=?,
            izvorni_naslov=?,opis=?,jezik=?,dodao=?,
            odobren=?,vrijeme_trajanja=?,budzet=?,prihod=?,ocjena=?,broj_ocjena=?,
            popularnost=?,za_odrasle=?,status=?,video=?,tagline=?,pozadina_url=?,
            poster_url=? WHERE id=?`;

        let podaci = [film.tmdb_id, film.imdb_id, film.tmdb_url, film.naslov,
            film.izvorni_naslov, film.opis, film.jezik, film.dodao, film.odobren, 
            film.vrijeme_trajanja, film.budzet, film.prihod, film.ocjena, film.broj_ocjena, 
            film.popularnost, film.za_odrasle, film.status, film.video, film.tagline, 
            film.pozadina_url, film.poster_url, id];
        
        baza.spojiSeNaBazu();
        await baza.izvrsiUpit(sql, podaci).catch(greska => console.log(greska));
        baza.zatvoriVezu();
        
        return true;
    }

    async brisi(id) {
        let baza = new Baza();
        baza.spojiSeNaBazu();
        let sql = `DELETE FROM filmovi WHERE id=?`;

        await baza.izvrsiUpit(sql, [id]);
        baza.spojiSeNaBazu();

        return true;
    }
}

module.exports = FilmDAO;