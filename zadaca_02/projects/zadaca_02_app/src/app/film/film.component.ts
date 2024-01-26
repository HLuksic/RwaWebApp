import { Component, Inject, Injectable, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { FilmoviPregledComponent } from '../filmovi-pregled/filmovi-pregled.component';
import { FilmI } from '../servisi/filmI';
import { JwtService } from '../servisi/jwt.service';

@Component({
    selector: 'app-film',
    templateUrl: './film.component.html',
    styleUrls: ['./film.component.scss']
})

export class FilmComponent {
    @Input()
    film: FilmI|null = null;
    posterUrl: string = "";

    public constructor(@Inject(AppComponent) private parent: AppComponent, private jwt: JwtService) {
        this.posterUrl = environment.posteriPutanja;
        this.film = parent.odabraniFilm;
    }
}
