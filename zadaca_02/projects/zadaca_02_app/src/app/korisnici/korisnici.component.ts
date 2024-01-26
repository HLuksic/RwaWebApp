import { Component, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { JwtService } from '../servisi/jwt.service';

interface KorisnikI {
    id: number;
    ime: string;
    prezime: string;
    email: string;
    korime: string;
    datum_rodenja: string;
    uloga: number;
}

@Component({
    selector: 'app-korisnici',
    templateUrl: './korisnici.component.html',
    styleUrls: ['./korisnici.component.scss']
})

export class KorisniciComponent {
    status: number = 0;
    korisnici: Array<KorisnikI> = [];

    public constructor(@Inject(AppComponent) private parent: AppComponent, private jwt: JwtService) {}
    
    ngOnInit(): void {
        this.dajKorisnike();
    }

    async dajKorisnike() {
        let parametri = { method: 'POST' }
        parametri = await this.jwt.dodajToken(parametri);
        let odgovor = await fetch(environment.appServer + "/korisnici", parametri);
        this.status = odgovor.status;
        
        if (odgovor.status == 200) {
            let podaci = await odgovor.text();
            this.korisnici = JSON.parse(podaci);
            // prikaziFilmove(podaci);
            // prikaziStranicenje(str, 100, "dajFilmove");
        }
        else if (odgovor.status == 401) {
            // document.getElementById("sadrzaj").innerHTML = "";
            alert("Neautoriziran pristup, prijavite se!");
            this.parent.title = "Početna";
            // window.location.replace("../");
        }
    }
}
