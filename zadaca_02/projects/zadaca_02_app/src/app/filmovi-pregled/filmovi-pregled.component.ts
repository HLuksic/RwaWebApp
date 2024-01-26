import { Component, Inject, Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { JwtService } from '../servisi/jwt.service';
import { ParametriI } from '../servisi/parametriI';
import { FilmI } from '../servisi/filmI';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-filmovi-pregled',
    templateUrl: './filmovi-pregled.component.html',
    styleUrls: ['./filmovi-pregled.component.scss']
})

export class FilmoviPregledComponent {
    
    status: number = 0;
    pretraga: string = "";
    filmovi: Array<FilmI> = [];
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
        let parametri: ParametriI = { method: 'POST', headers: undefined };
        
        parametri = await this.jwt.dodajToken(parametri);
        let odgovor = await fetch(environment.appServer + "/filmoviPregled?stranica=" + str + "&naziv=" + this.pretraga + "&traziOdobrene=1", parametri);
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
    }
    
    dajFilter(event: any) {
        this.pretraga = event.target.value;
    }

    detaljiFilma(film: FilmI) {
        this.parent.odabraniFilm = film;
        this.parent.title = "Film";
    }
}
    