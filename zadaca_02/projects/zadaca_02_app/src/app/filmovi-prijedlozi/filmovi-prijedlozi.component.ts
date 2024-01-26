import { Component, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { FilmI } from '../servisi/filmI';
import { JwtService } from '../servisi/jwt.service';
import { ParametriI } from '../servisi/parametriI';

@Component({
    selector: 'app-filmovi-prijedlozi',
    templateUrl: './filmovi-prijedlozi.component.html',
    styleUrls: ['./filmovi-prijedlozi.component.scss']
})

export class FilmoviPrijedloziComponent {
    status: number = 0;
    pretraga: string = "";
    filmovi: Array<FilmI> = [];
    posterUrl: string = "";

    public constructor(@Inject(AppComponent) private parent: AppComponent, private jwt: JwtService) {
        this.posterUrl = environment.posteriPutanja;
    }

    ngOnInit(): void {
        this.dajFilmove(1);
    }

    async dajFilmove(str: number) {
        let parametri: ParametriI  = { method: 'POST', headers: undefined };

        parametri = await this.jwt.dodajToken(parametri);
        let odgovor = await fetch(environment.appServer + "/filmoviPregled?stranica=" + str + "&naziv=" + this.pretraga + "&traziOdobrene=0", parametri);
        this.status = odgovor.status;

        if (odgovor.status == 200) {
            let podaci = await odgovor.text();
            this.filmovi = JSON.parse(podaci);
            // prikaziFilmove(podaci);
            // prikaziStranicenje(str, 100, "dajFilmove");
        }
        if (odgovor.status == 401) {
            // document.getElementById("sadrzaj").innerHTML = "";
            alert("Neautoriziran pristup, prijavite se!");
            this.parent.title = "Početna";
            // window.location.replace("../");
        }
        // else {
        //     poruka.innerHTML = "Greška u dohvatu filmova!"
        // }
    }

    async odobri(film: FilmI) {
        film.odobren = true;
        let parametri: ParametriI = { method: 'PUT', body: JSON.stringify(film) }
        parametri = await this.jwt.dodajToken(parametri);
        let odgovor = await fetch(environment.appServer + "/azurirajFilm", parametri);
        
        if (odgovor.status == 200) {
            alert("Film odobren!");
        } 
        else if (odgovor.status == 401) {
            alert("Neautoriziran pristup, prijavite se!");
            window.location.replace("../");
        } 
        else {
            alert("Pogreška u odobrenju filma: " + odgovor.status + " - " + odgovor.statusText);
        }

        await new Promise(f => setTimeout(f, 500)).then(() => this.dajFilmove(1));
    }
    
    async brisi(idFilma: number) {
        let parametri: ParametriI = { method: 'DELETE' }
        parametri = await this.jwt.dodajToken(parametri);
        await fetch(environment.appServer + "/film?id=" + idFilma, parametri);
    }
}
