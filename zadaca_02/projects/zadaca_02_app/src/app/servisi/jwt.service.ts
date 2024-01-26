import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ParametriI } from './parametriI';

@Injectable({
    providedIn: 'root'
})

export class JwtService {

    async dodajToken(parametri: ParametriI) {
        let zaglavlje = new Headers();
    
        if (parametri.headers != null && parametri.headers != undefined)
            zaglavlje = parametri.headers;
    
        let token = await this.dajToken();
        zaglavlje.set("Authorization", token);
        zaglavlje.set("Content-Type", "application/json");
        parametri.headers = zaglavlje;
    
        return parametri;
    }
    
    async dajToken() {
        let odgovor = await fetch(environment.appServer + "/getJWT");
        let tekst = JSON.parse(await odgovor.text());
        if (tekst.ok != null)
            return tekst.ok;
        else
            return "0000";
    }
    
    // function vratiHrvatskiDatum(datum) {
    //     return dateFormat(datum, "dd.mm.yyyy");
    // }
    
    // function vratiIsoDatum(datum) {
    //     return dateFormat(datum, "yyyy-mm-dd");
    // }
    
}
