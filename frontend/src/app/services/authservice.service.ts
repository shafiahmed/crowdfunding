import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TokenAndUserData } from './token-and-user-data'
import 'rxjs/add/operator/map';
@Injectable()
export class AuthserviceService {

  preLoginRoute: any; // route from where user redirected to login Page for purpose of again directing to 
  // the requested page.This variable is again accessed by login page for router,navigate().
  constructor(private _http: Http,
     @Inject(PLATFORM_ID) private platformId: Object,
    private tokenAndUserData: TokenAndUserData
    ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadToken();
    }
  }


  //====================
  //   REGISTRATION
  //====================
  registerUser(user) {
    let header = new Headers()
    header.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/user/register', user, { headers: header }).
      map(res => res.json());
    //return this._http.post('http://107.20.93.175/user/register',user,{headers:header}).
    // map(res => res.json());
  }

  //==========================
  //       LOG IN
  //==========================
  userLogin(loginData) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/user/authenticate', loginData, { headers: header }).
      map(res => res.json());
    //return this._http.post('http://107.20.93.175/user/authenticate',loginData,{headers: header}).
    //map(res => res.json());
  }
  //========================================================
  //       FACEBOOK / GOOGLE / LINKEDINmLOGIN/ SIGNUP
  //========================================================

  socialMediaSignIn(tokenFromUrl){
    let header = new Headers();
    header.append('Authorization', tokenFromUrl);
    header.append('Content-Type', 'application/json');
    return this._http.get('http://localhost:3000/user/profile', { headers: header }).map(res => res.json());
    //return this._http.get('http://107.20.93.175/user/profile',{headers: header}).map(res => res.json());
  }



  //================================================================
  //          CHECK USER PHONE IS VERIFIED AND IN DB
  //================================================================
  isPhoneRegistered(): any {
    let headers = new Headers();
    headers.append('Authorization', this.tokenAndUserData.authToken);
    headers.append('Content-Type', 'application/json');
    return this._http.get('http://localhost:3000/user/isphoneverified', { headers: headers }).map(res => res.json());
   // return this._http.get('http://107.20.93.175/user/isphoneverified', { headers: headers }).map(res => res.json());
  }

  //======================================================================================================
  //      PROFILE PAGE         ### communicates with backend and receives user Profile data if successful
  //======================================================================================================
  getProfile() {
    let header = new Headers();
    this.loadToken();
    header.append('Authorization', this.tokenAndUserData.authToken);
    header.append('Content-Type', 'application/json');
    return this._http.get('http://localhost:3000/user/profile', { headers: header }).map(res => res.json());
    //return this._http.get('http://107.20.93.175/user/profile',{headers: header}).map(res => res.json());
  }

  //=============================================================================================
  //       STORE TOKEN        ### Stores user token sent by backend into browser's local storage
  //=============================================================================================
  storeUserData(token: any, userdata: any) {
    localStorage.clear();
    this.tokenAndUserData.authToken = null;
    this.tokenAndUserData.userData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('id_token', token);
      //localStorage.setItem('user', JSON.stringify(userData));
      this.tokenAndUserData.authToken = token;
     // this.userData = userdata;
    }
  }
  //=============================================================================================================
  //       LOADS TOKEN ALONG WITH EVERY AUTHORIZED REQUEST TO BACKEND     ### successfull if session not expired
  //=============================================================================================================
  loadToken() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('id_token');
      //const userData =  localStorage.getItem('user');
      this.tokenAndUserData.authToken = token;
      //this.userData = JSON.parse(userData);
    }

  }

  retrieveCampaignState(){
    let header = new Headers();
    header.append('Authorization', this.tokenAndUserData.authToken);
    header.append('Content-Type', 'application/json');
    return this._http.get('http://localhost:3000/user/retrieve-campaign-state', { headers: header }).map(res => res.json());
  }

  saveCampaignState(campaignObjectState){
    let header = new Headers();
    header.append('Authorization', this.tokenAndUserData.authToken);
    header.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/user/save-campaign-state',campaignObjectState, { headers: header }).map(res => res.json());
  }

  destroyCampaignState(){
    let header = new Headers();
    header.append('Authorization', this.tokenAndUserData.authToken);
    header.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/user/destroy-campaign-state',{}, { headers: header }).map(res => res.json());
  }
  //===========================================================================
  //       LOGGED IN           ### returns true if user is looged in
  //===========================================================================
  isLoggedIn() {
    //use the localStorage token key name ,'id_token' in this case with TokenNotFound()
    if (isPlatformBrowser(this.platformId)) {
      return tokenNotExpired('id_token');
    }
  }


  //===========================================================================
  //       LOGS OUT              ### Clears token from browsers local storage
  //===========================================================================
  logOut() {
    this.tokenAndUserData.authToken = null;
    this.tokenAndUserData.userData = null;
    this.tokenAndUserData.isAdmin = false;
    localStorage.clear();
  }

}
