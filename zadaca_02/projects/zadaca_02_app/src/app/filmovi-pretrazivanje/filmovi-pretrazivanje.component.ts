import { Component, Inject } from '@angular/core';
import { AppComponent } from '../app.component';
import { JwtService } from '../servisi/jwt.service';
import { ParametriI } from '../servisi/parametriI';
import { FilmI, TMDBFilmI } from '../servisi/filmI';
import { environment } from '../../environments/environment';

interface PodaciI {
    results: Array<TMDBFilmI>;
}

@Component({
    selector: 'app-filmovi-pretrazivanje',
    templateUrl: './filmovi-pretrazivanje.component.html',
    styleUrls: ['./filmovi-pretrazivanje.component.scss']
})

export class FilmoviPretrazivanjeComponent {
    status: number = 0;
    pretraga: string = "";
    filmovi: Array<TMDBFilmI> = [];
    posterUrl: string = "";
    trenutnaStranica: number = 1;
    ukupnoStranica: number = 100;

    public constructor(@Inject(AppComponent) private parent: AppComponent, private jwt: JwtService) {
        this.posterUrl = environment.posteriPutanja;
    }

    ngOnInit(): void {
        this.dajFilmove(1);
    }

    async dajFilmove(str: number) {
        let parametri: ParametriI = { method: 'POST' };

        parametri = await this.jwt.dodajToken(parametri);
        let odgovor = await fetch(environment.appServer + "/filmoviPretrazivanje?str=" + str + "&filter=" + this.pretraga, parametri);
        this.status = odgovor.status;

        if (odgovor.status == 200) {
            let podaci: PodaciI = JSON.parse(await odgovor.text()) as unknown as PodaciI;
            this.filmovi = podaci.results;
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

    async dodajUbazu(film: TMDBFilmI) {
        console.log(film);

        let parametri: ParametriI = { method: 'POST', body: JSON.stringify(film) }
        parametri = await this.jwt.dodajToken(parametri);
        let odgovor = await fetch(environment.appServer + "/dodajFilm", parametri);
        
        if (odgovor.status == 200) {
            alert("Film dodan u bazu!");
        } 
        else if (odgovor.status == 401) {
            alert("Neautoriziran pristup, prijavite se!");
            window.location.replace("../");
        } 
        else {
            alert("Pogreška u dodavanju filma, provjerite postoje li žanrovi!");
        }
    }

    dajFilter(event: any) {
        this.pretraga = event.target.value;
    }
}
