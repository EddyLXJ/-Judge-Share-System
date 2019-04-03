import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DataService} from './services/data.service';
import { routing} from './app.routes';
import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetialComponent } from './components/problem-detial/problem-detial.component';

@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetialComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [{
    provide: 'data',
    useClass: DataService
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
