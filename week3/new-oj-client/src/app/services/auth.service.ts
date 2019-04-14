import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import Auth0Lock from 'auth0-lock';
import {HttpResponse, HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {



  lock = new Auth0Lock(AUTH_CONFIG.clientID, AUTH_CONFIG.domain, {
    autoclose: true,
    auth: {
      redirectUrl: AUTH_CONFIG.callbackURL,
      responseType: 'token id_token',
      params: {
        scope: 'openid profile'
      }
    }
  });
  username: string = "";

  constructor(public router: Router, private http: HttpClient) {}

  public login(){
    this.lock.show();
  }

  // Call this method in app.component.ts
  // if using path-based routing
  public handleAuthentication(): void {
    this.lock.on('authenticated', (authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // this.username = this.getProfile()['nickname'];

        this.setSession(authResult);
        this.router.navigate(['/']);
      }
    });
    this.lock.on('authorization_error', (err) => {
      this.router.navigate(['/']);
      console.log(err);
      alert(`Error: ${err.error}. Check the console for further details.`);
    });
  }

  // Call this method in app.component.ts
  // if using hash-based routing
  public handleAuthenticationWithHash(): void {
    this
      .router
      .events
      .pipe(
        filter(event => event instanceof NavigationStart),
        filter((event: NavigationStart) => (/access_token|id_token|error/).test(event.url))
      )
      .subscribe(() => {
        this.lock.resumeAuth(window.location.hash, (err, authResult) => {
          if (err) {
            this.router.navigate(['/']);
            console.log(err);
            alert(`Error: ${err.error}. Check the console for further details.`);
            return;
          }

          this.setSession(authResult);
          this.router.navigate(['/']);
        });
      });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    new Promise((resolve, reject) => {
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          // Handle
          alert(error);
          return;
        }
        localStorage.setItem("profile", JSON.stringify(profile));
        resolve(profile['nickname']);
        // Update DOM
      });
    }).then(username => {

      this.username =  username as string;

    });

    // localStorage.setItem('profile',authResult.profile);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public getProfile(): any {
    return JSON.parse(localStorage.getItem('profile'));
  }

  public resetPassword(): void{
    let profile = this.getProfile();
    let url: string = "https://"+ AUTH_CONFIG.domain + "/dbconnections/change_password";
    const headers = { headers : new HttpHeaders({'content-type': 'application/json'})};
    let body =  { client_id: AUTH_CONFIG.clientID,
        email: profile['name'],
        connection: 'Username-Password-Authentication'
      };

    this.http.post(url,body, headers)
      .toPromise()
      .then((res: any) => {
        console.log(res);
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any>{
    console.error("Error", error);
    return Promise.reject(error.message || error);
  }

}
