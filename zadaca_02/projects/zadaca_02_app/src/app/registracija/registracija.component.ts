import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
    selector: 'app-registracija',
    templateUrl: './registracija.component.html',
    styleUrls: ['./registracija.component.scss']
})

export class RegistracijaComponent {
    url = environment.appServer;

    constructor(private recaptchaV3Service: ReCaptchaV3Service) { }

    validacija(obrazac: HTMLFormElement) {
        let ime = obrazac['ime'].value;
        let prezime = obrazac['prezime'].value;
        let email = obrazac['email'].value;
        let korime = obrazac['korime'].value;
        let lozinka = obrazac['lozinka'].value;
        let greska = "";

        let rIme = new RegExp(/^$|^[a-zA-Z]{1,50}$/g);
        let rPrezime = new RegExp(/^$|^[a-zA-Z]{1,100}$/g);
        let rKorime = new RegExp(/^[a-zA-Z0-9]{1,50}$/g);
        let rLozinka = new RegExp(/^[a-zA-Z0-9#$%&]{1,}$/g);

        if (email == "" || korime == "" || lozinka == "") greska += "Podaci označeni sa * moraju biti uneseni!\n";
        if (!rIme.test(ime)) greska += "Ime je u krivom formatu!\n";
        if (!rPrezime.test(prezime)) greska += "Prezime je u krivom formatu!\n";
        if (!rKorime.test(korime)) greska += "Korisničko ime u krivom formatu!\n";
        if (!rLozinka.test(lozinka)) greska += "Lozinka u krivom formatu!\n";

        if (greska) {
            alert(greska);
            return false;
        }
        return true;
    }

    salji() {
        this.recaptchaV3Service.execute('importantAction')
            .subscribe(async (token: string) => {
                console.log(token);
            });
    }
}
