import {Component, Inject, OnInit} from '@angular/core';
import {AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = 'Online Judge System';
  username = '';
  constructor(public auth: AuthService) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      let profile = this.auth.getProfile();
      this.username = profile["nickname"];
    }
  }

  login(): void {
    this.auth.login();
    let profile = this.auth.getProfile();
    this.username = profile["nickname"];
  }

  // logout(): void {
  //   this.auth.logout();
  // }
  //
  // isAuthenticateed(): boolean{
  //   this.auth.isAuthenticated();
  // }

}
