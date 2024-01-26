import { Component, Inject } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from '../../environments/environment';
import { NavigacijaComponent } from '../navigacija/navigacija.component';

@Component({
    selector: 'app-prijava',
    templateUrl: './prijava.component.html',
    styleUrls: ['./prijava.component.scss']
})

export class PrijavaComponent {

    url: string = environment.appServer;

    constructor(@Inject(NavigacijaComponent) private navigacija: NavigacijaComponent, private recaptchaV3Service: ReCaptchaV3Service) { }

    dajUlogu() {
        this.navigacija.dajUlogu();
    }

    salji() {
        this.recaptchaV3Service.execute('importantAction')
            .subscribe(async (token: string) => {
                console.log(token);
            });
    }
}
