import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtService } from './servisi/jwt.service';

import { AppComponent } from './app.component';
import { PodnozjeComponent } from './podnozje/podnozje.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { NavigacijaComponent } from './navigacija/navigacija.component';
import { FilmoviPregledComponent } from './filmovi-pregled/filmovi-pregled.component';
import { FilmoviPretrazivanjeComponent } from './filmovi-pretrazivanje/filmovi-pretrazivanje.component';
import { FilmoviPrijedloziComponent } from './filmovi-prijedlozi/filmovi-prijedlozi.component';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { ZanroviComponent } from './zanrovi/zanrovi.component';
import { FilmComponent } from './film/film.component';
import { ProfilComponent } from './profil/profil.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

@NgModule({
    declarations: [
        AppComponent,
        PodnozjeComponent,
        DokumentacijaComponent,
        PocetnaComponent,
        NavigacijaComponent,
        FilmoviPregledComponent,
        FilmoviPretrazivanjeComponent,
        FilmoviPrijedloziComponent,
        KorisniciComponent,
        ZanroviComponent,
        FilmComponent,
        ProfilComponent,
        RegistracijaComponent,
        PrijavaComponent,
    ],
    imports: [
        BrowserModule, RecaptchaV3Module
    ],
    providers: [JwtService, FilmoviPregledComponent, { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6Le5DukjAAAAAPgPryVtg8IPMtA6ivoGKr1HZqFy"}],
    bootstrap: [AppComponent]
})
export class AppModule { }
