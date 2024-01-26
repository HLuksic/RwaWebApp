import { Component } from '@angular/core';
import { FilmoviService } from '../servisi/filmovi.service';
import { FilmoviI } from '../servisi/FilmoviI';

@Component({
    selector: 'app-popis-filmova',
    templateUrl: './popis-filmova.component.html',
    styleUrls: ['./popis-filmova.component.css']
})

export class PopisFilmovaComponent {
    filmovi?: Array<FilmoviI>;
    sviFilmovi?: Array<FilmoviI>;
    filmoviService?: FilmoviService;
    nazivFilma?: string;
    putanja?: string;
    
    constructor() {
        this.filmoviService = new FilmoviService();
        this.filmovi = new Array<FilmoviI>();
    }

    ngOnInit() {
        this.provjeriPodatke();
        if (this.filmovi?.length == 0) {
            setTimeout(this.provjeriPodatke.bind(this), 3000);
        }
    }

    provjeriPodatke() {
        this.filmovi = this.filmoviService?.dajFilmove();
        this.sviFilmovi = this.filmovi;
    }

    dajOpis(naziv?: string) {
        this.nazivFilma = naziv;
    }

    makniOpis() {
        this.nazivFilma = "";
    }
}
