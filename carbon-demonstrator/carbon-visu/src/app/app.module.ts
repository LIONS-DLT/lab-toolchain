import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CapAndTradeWidgetComponent } from './_components/cap-and-trade-widget/cap-and-trade-widget.component';

@NgModule({
  declarations: [
    AppComponent,
    CapAndTradeWidgetComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
