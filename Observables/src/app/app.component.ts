import { Component, OnInit} from '@angular/core';
import {Observable, fromEvent, from, interval, timer, range} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Observables';

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    const source$ = from(['admin', 'bill', 'Cow'])
      .pipe(map(v => v.toUpperCase()))
      .pipe(map(v => 'I am ' + v));
    source$.subscribe(
      v => console.log(v),
      err => console.log(err),
      () => console.log('completed')
    )
  }

  // getUser(username){
  //   return this.http.get('https://api.github.com/users/' + username);
  // }





}
