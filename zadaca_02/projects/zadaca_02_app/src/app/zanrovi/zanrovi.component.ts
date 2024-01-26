import { Component, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { JwtService } from '../servisi/jwt.service';

interface ZanrI {
    id: number;
    tmdb_id: number;
    naziv: string;
}

@Component({
    selector: 'app-zanrovi',
    templateUrl: './zanrovi.component.html',
    styleUrls: ['./zanrovi.component.scss']
})

export class ZanroviComponent {
    status: number = 0;
    pretraga: string = "";
    zanrovi: Array<ZanrI> = [];
    posterUrl: string = "";

    public constructor(@Inject(AppComponent) private parent: AppComponent, private jwt: JwtService) {
        this.posterUrl = environment.posteriPutanja;
    }

    ngOnInit(): void {
        this.dajZanrove();
    }

    async dajZanrove() {
        let parametri = { method: 'GET' }
        parametri = await this.jwt.dodajToken(parametri);
        let odgovor = await fetch(environment.appServer + "/dajSveZanrove", parametri);
        this.status = odgovor.status;

        if (odgovor.status == 200) {
            let podaci = await odgovor.text();
            this.zanrovi = JSON.parse(podaci);
            // prikaziFilmove(podaci);
            // prikaziStranicenje(str, 100, "dajFilmove");
        }
        if (odgovor.status == 401) {
            // document.getElementById("sadrzaj").innerHTML = "";
            alert("Neautoriziran pristup, prijavite se!");
            this.parent.title = "Početna";
            // window.location.replace("../");
        }
        if (odgovor.status == 417) {
            alert("Žanrovi već postoje!");
        } 
    }
    
    async dodajSve() {
        await fetch(environment.appServer + "/dodajZanrove", { method: 'GET' });
    }
}
