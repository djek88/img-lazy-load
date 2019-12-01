import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ImgLazyLoadDirective } from './img-lazy-load.directive';
import { SpinnerComponent } from './spinner/spinner.component';

import { WINDOW_PROVIDERS } from './services/window.service';

@NgModule({
  declarations: [
    AppComponent,
    ImgLazyLoadDirective,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    WINDOW_PROVIDERS
  ],
  entryComponents: [
    SpinnerComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
