export interface FilmI {
    tmdb_id: number;
    imdb_id: string;
    tmdb_url: string;
    id: number;
    naslov: string;
    izvorni_naslov: string;
    jezik: string;
    datum_objave: string;
    datum_dodavanja: string;
    dodao: number;
    odobren: boolean;
    zanr: string;
    opis: string;
    ocjena: number;
    broj_ocjena: number;
    popularnost: number;
    za_odrasle: boolean;
    status: string;
    video: boolean;
    tagline: string;
    vrijeme_trajanja: number;
    budzet: number;
    prihod: number;
    pozadina_url: string;
    poster_url: string;
}

export interface TMDBFilmI {
    id: number; 
    imdb_id: number; 
    homepage: string; 
    title: string;
    original_title: string;
    overview: string; 
    original_language: string; 
    release_date: string;
    runtime: number; 
    budget: number;
    revenue: number; 
    vote_average: number; 
    vote_count: number; 
    popularity: number; 
    adult: boolean;
    status: string; 
    video: boolean; 
    tagline: string; 
    backdrop_path: string; 
    poster_path: string;
}