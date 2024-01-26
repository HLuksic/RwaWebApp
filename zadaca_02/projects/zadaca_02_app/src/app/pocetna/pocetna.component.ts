import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { FilmI } from '../servisi/filmI';
import { ZanrI } from '../servisi/zanrI';

@Component({
    selector: 'app-pocetna',
    templateUrl: './pocetna.component.html',
    styleUrls: ['./pocetna.component.scss']
})

export class PocetnaComponent {
    zanrovi: Array<ZanrI> = [];

    async ngOnInit() {
        this.zanrovi = await this.dohvatiZanrove();
    }

    async dohvatiZanrove(): Promise<Array<ZanrI>> {
        let odgovor = await fetch(environment.appServer + "/dajSveZanrove");
        let podaci = await odgovor.text();
        let zanrovi = JSON.parse(podaci);
        for (let i = 0; i < zanrovi.length; i++) {
            zanrovi[i].dva_filma = await this.dohvatiFilmove(zanrovi[i].naziv);
        }
        return zanrovi;
    }

    async dohvatiFilmove(zanr: string) {
        let odgovor = await fetch(environment.appServer + "/dajDvaFilma?zanr=" + zanr);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);
        return filmovi;
    }
}
