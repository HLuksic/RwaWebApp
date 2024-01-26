import { FilmI } from "./filmI";

export interface ZanrI {
    id: number;
    naziv: string;
    opis: string;
    tmdb_id: number;
    dva_filma: Array<FilmI>;
}