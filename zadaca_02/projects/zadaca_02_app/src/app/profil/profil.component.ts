import { Component, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { JwtService } from '../servisi/jwt.service';

interface KorisnikI {
    ime: string;
    prezime: string;
    datum_rodenja: string;
    email: string;
    korime: string;
    uloga: number;
}

@Component({
    selector: 'app-profil',
    templateUrl: './profil.component.html',
    styleUrls: ['./profil.component.scss']
})

export class ProfilComponent {
    status: number = 0;

    korisnik: KorisnikI|undefined = undefined;

    constructor(@Inject(AppComponent) private parent: AppComponent, private jwt: JwtService) { }

    ngOnInit(): void {
        this.prikaziPodatke();
    }

    async prikaziPodatke() {
        let parametri = { method: 'POST' }
        parametri = await this.jwt.dodajToken(parametri);
        let odgovor = await fetch(environment.appServer + "/profil", parametri);
        this.status = odgovor.status;
    
        if (odgovor.status == 200) {
            let podaci = await odgovor.text();
            this.korisnik = JSON.parse(podaci);
        } 
        else if (odgovor.status == 401) {
            alert("Neautoriziran pristup, prijavite se!");
            window.location.replace("../");
        } 
    }
}
