import { Component } from '@angular/core';
import { FilmI } from './servisi/filmI';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    odabraniFilm: FilmI|null = null;
    title = 'Početna';    
}
