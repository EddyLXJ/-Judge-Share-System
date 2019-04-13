import { Component, OnInit} from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'new-oj-client';
  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }

}
