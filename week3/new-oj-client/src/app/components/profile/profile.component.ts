import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email: string = ""
  username: string =""

  constructor(private auth: AuthService) { }

  ngOnInit() {
    let profile = this.auth.getProfile();
    this.email = profile['name'];
    this.username = profile['nickname']
  }

  resetPassword() {
    this.auth.resetPassword();
  }

}
