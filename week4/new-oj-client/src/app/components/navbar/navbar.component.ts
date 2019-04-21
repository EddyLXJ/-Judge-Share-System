import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {AuthService } from '../../services/auth.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  title = 'Online Judge System';
  username = '';

  searchBox: FormControl = new FormControl();
  subscription: Subscription;

  constructor(public auth: AuthService,
              @Inject('input') private input,
              private router: Router) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      let profile = this.auth.getProfile();
      this.auth.username = profile["nickname"];
    }

    this.subscription = this.searchBox.valueChanges.pipe(debounceTime(200))
      .subscribe(
      term => {
        this.input.changeInput(term);
      }
    );
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

  searchProblem(): void{
    this.router.navigate(['/problems']);
  }

  login(): void {
    this.auth.login();
  }

  // logout(): void {
  //   this.auth.logout();
  // }
  //
  // isAuthenticateed(): boolean{
  //   this.auth.isAuthenticated();
  // }

}
