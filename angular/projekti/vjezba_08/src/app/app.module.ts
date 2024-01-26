import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PopisFilmovaComponent } from './popis-filmova/popis-filmova.component';

@NgModule({
    declarations: [
        AppComponent,
        PopisFilmovaComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
