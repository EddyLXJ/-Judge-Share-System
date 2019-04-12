// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {

  private IdToken: string;
  private AccessToken: string;
  private ExpiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: 'isWhWosh16Dn4lt3Cgn5ZA9xCLiIwrFR',
    domain: 'cs-503.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:3000/callback',
    scope: 'openid'
  });

  constructor(public router: Router) {
    this.IdToken = '';
    this.AccessToken = '';
    this.ExpiresAt = 0;
  }

  get accessToken(): string {
    return this.AccessToken;
  }

  get idToken(): string {
    return this.IdToken;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.localLogin(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private localLogin(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + Date.now();
    this.AccessToken = authResult.accessToken;
    this.IdToken = authResult.idToken;
    this.ExpiresAt = expiresAt;
  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this.AccessToken = '';
    this.IdToken = '';
    this.ExpiresAt = 0;

    this.auth0.logout({
      return_to: window.location.origin
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const now = Date.now();
    return this.AccessToken && now < this.ExpiresAt;
  }

}



