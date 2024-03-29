import { ElementSchemaRegistry } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { FilmoviI } from './FilmoviI';

@Injectable({
    providedIn: 'root'
})

export class FilmoviService {
    restServis?: string;
    filmoviTMDB?: FilmoviTmdbI;
    filmovi = new Array<FilmoviI>();

    constructor() {
        this.restServis = environment.restServis;
        let filmovi = localStorage.getItem("filmovi");

        if (filmovi == null) {
            this.osvjeziFilmove(1, "");
        } else {
            this.filmoviTMDB = JSON.parse(filmovi);
        }
    }

    async osvjeziFilmove(stranica: number, kljucnaRijec: string) {
        let parametri = "?stranica=" + stranica + "&kljucnaRijec=" + kljucnaRijec;
        let o = (await fetch(this.restServis + "tmdb/filmovi" + parametri)) as Response;
        if (o.status == 200) {
            let r = JSON.parse(await o.text()) as FilmoviTmdbI;
            console.log(r);
            this.filmoviTMDB = r;
        }
    }

    dajFilmove(): Array<FilmoviI> {
        if (this.filmovi.length == 0) {
            if (this.filmoviTMDB == undefined) {
                return new Array<FilmoviI>();
            } else if (this.filmoviTMDB.results.length == 0) {
                return new Array<FilmoviI>();
            } else {
                this.filmovi = new Array<FilmoviI>();
                for (let filmTMDB of this.filmoviTMDB.results) {
                    let film: FilmoviI = {
                        naziv: filmTMDB.original_title,
                        opis: filmTMDB.overview
                    };
                    this.filmovi.push(film);
                }
                return this.filmovi;
            }
        } else {
            return this.filmovi;
        }
    }

    dajFilm(naziv: string): FilmTmdbI | null {
        if (this.filmoviTMDB == undefined)
            return null;
        if (this.filmoviTMDB.results.length == 0)
            return null;
        for (let film of this.filmoviTMDB.results) {
            if (film.original_title == naziv) {
                return film;
            }
        }
        return null;
    }
}

export interface FilmoviTmdbI {
    page: number;
    results: Array<FilmTmdbI>;
    total_pages: number;
    total_results: number;
}

export interface FilmTmdbI {
    adult: boolean;
    backdrop_path: string;
    genre_ids: Array<number>;
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}