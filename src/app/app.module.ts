import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ObservableComponent } from './observable/observable.component';
import { SubjectComponent } from './subject/subject/subject.component';


@NgModule({
  declarations: [
    AppComponent,
    ObservableComponent,
    SubjectComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
