import { Component, Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { JwtService } from '../servisi/jwt.service';

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'app-navigacija',
    templateUrl: './navigacija.component.html',
    styleUrls: ['./navigacija.component.scss']
})

export class NavigacijaComponent {
    korisnikUloga: number = 3;
    
    public constructor(@Inject(AppComponent) public parent: AppComponent, private jwt: JwtService) { }
    
    ngOnInit(): void {
        this.dajUlogu();
    }
    
    public promijeniNaslov(naslov: string): void {
        this.parent.title = naslov;
    }
    
    public async dajUlogu() {
        let parametri = { method: 'POST' }
        parametri = await this.jwt.dodajToken(parametri);
        let odgovor = await fetch(environment.appServer + "/profil", parametri);
    
        if (odgovor.status == 200) {
            let podaci = await odgovor.text();
            let korisnik = JSON.parse(podaci);
            korisnik ? this.korisnikUloga = korisnik.uloga : this.korisnikUloga = 3;
        } 
        else if (odgovor.status == 401) {
            alert("Neautoriziran pristup, prijavite se!");
            window.location.replace("../");
        } 
    }
    
    async odjaviKorisnika() {
        await fetch(environment.appServer + "/odjava", { method: 'GET' });
        window.location.replace("/");
    }
}
