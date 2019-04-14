import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import Auth0Lock from 'auth0-lock';
import * as auth0 from 'auth0-js';
import {HttpResponse, HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {



  lock = new Auth0Lock(AUTH_CONFIG.clientID, AUTH_CONFIG.domain, {
    autoclose: true,
    auth: {
      redirectUrl: AUTH_CONFIG.callbackURL,
      responseType: 'token id_token',
      params: {
        scope: 'openid email user_metadata app_metadata profile'
      }
    }
  });

  username: string = "";
  admin: string = "";

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
      this.getUser();
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
        email: profile['email'],
        connection: 'Username-Password-Authentication'
      };

    this.http.post(url,body, headers)
      .toPromise()
      .then((res: any) => {
        console.log(res);
      })
      .catch(this.handleError);
  }

  public getUser(): void{
    let profile = this.getProfile();
    let url :string = "https://" + AUTH_CONFIG.domain + "/api/v2/users-by-email?email=" + profile['email'];
    const headers = { headers: new HttpHeaders({authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJVWTRRVEl4TWpOQ056azJSREJCUXpoR01rSkdOakU1TWtJd05FSXlNelExT0ROQk9FRTJSQSJ9.eyJpc3MiOiJodHRwczovL2NzLTUwMy5hdXRoMC5jb20vIiwic3ViIjoiN2w4QUpWcUFuVWRndkNmS2poUHI5QW9kcnhJMVdUUUlAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vY3MtNTAzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNTU1MjczMzM1LCJleHAiOjE1NTUzNTk3MzUsImF6cCI6IjdsOEFKVnFBblVkZ3ZDZktqaFByOUFvZHJ4STFXVFFJIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyByZWFkOmFub21hbHlfYmxvY2tzIGRlbGV0ZTphbm9tYWx5X2Jsb2NrcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.UVv3LJBXFRWPFOcTt7B_IAJSqqyj-sWM3nMnWczVjlweV5hIB3S9_pWhyUkEc5sHU-J_U8ATZA2B-8SdYhB5U0zPgI51r7W7ls6HsoPMUe8MWotLzVpvBvB6isVoCnvZCW5XCHuY_8FTBmGKTSrsnfFHl-Rq_rbGRb6sUv_oYq3KKnKx5jtE4IbdaypsqVa-7-Y-WSirMCULQX6L3ENUvV4kDrrRumo8RqMTq3_Ue_lyDKz2KIfS9oQWG-qUrFHHJ7gX6bCk-4kOONgezyi2knPElqgASoAWgB2_6jhzMvs50knKhswqSH3WqisUtNF09IMpa6X65GBDX_3vgzLm6A', 'content-type': 'application/json'})};
    console.log(headers);
    console.log(url);
    this.http.get(url, headers)
      .toPromise()
      .then((res:any) => {
        localStorage.setItem('profile', JSON.stringify(res['0']));
        let profile = res['0'];
        let matedata = profile['app_metadata'];
        console.log(matedata);
        if (matedata['Admin']) {
          this.admin = matedata['Admin'];
        } else {
          this.admin = "";
        }
      })
      .catch(this.handleError);

  }

  private handleError(error: any): Promise<any>{
    console.error("Error", error);
    return Promise.reject(error.message || error);
  }


}
