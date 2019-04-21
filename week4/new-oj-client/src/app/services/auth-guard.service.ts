import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(public auth: AuthService, private router: Router) { }

  canActivate() :boolean{
    if(this.auth.isAuthenticated()){
      return true;
    } else {
      //redirect to home page if not logged in
      this.router.navigate(['/problems']).then(good => console.log(good));
      return false;
    }
  }

}


