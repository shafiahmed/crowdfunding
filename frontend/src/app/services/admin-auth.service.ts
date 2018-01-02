import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TokenAndUserData } from '../services/token-and-user-data'
import 'rxjs/add/operator/map';
@Injectable()
export class AdminAuthService {
  authToken: any;
  adminData: any;
  preLoginRoute: any; // route from where user redirected to login Page for purpose of again directing to 
  // the requested page.This variable is again accessed by login page for router,navigate().
  constructor(
    private _http: Http,
     @Inject(PLATFORM_ID) private platformId: Object,
     private _tokenAndUserData: TokenAndUserData
    ) {

    if (isPlatformBrowser(this.platformId)) {
      this.loadToken();
    }
  }


  adminLogin(loginData) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/admin/admin-login', loginData, { headers: header }).
      map(res => res.json());
    //return this._http.post('http://107.20.93.175/user/authenticate',loginData,{headers: header}).
    //map(res => res.json());
  }


  isLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      if (tokenNotExpired('id_token') && this._tokenAndUserData.isAdmin ) {

        return true
      }
      else {
        return false;
      }
    }
  }

  loadToken() {
    if (isPlatformBrowser(this.platformId)) {
      this._tokenAndUserData.authToken = localStorage.getItem('id_token');
      if(localStorage.getItem('admin')){
        this._tokenAndUserData.isAdmin = JSON.parse(localStorage.getItem('admin'));        
      }
    }
  }

  storeUserData(token: any, isAdmin: boolean) {
    localStorage.clear();
    this._tokenAndUserData.authToken = null;
    this._tokenAndUserData.userData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('id_token', token);
      localStorage.setItem('admin', JSON.stringify(isAdmin));
      this._tokenAndUserData.authToken = token;
      this._tokenAndUserData.isAdmin = isAdmin;
    }
  }
//########################################################################################################
//                               ADMINISTRATIVE FUNDRAISER OPERATIONS
//########################################################################################################

loadFundraisers(){
  let headers = new Headers();
  headers.append('Authorization',  this._tokenAndUserData.authToken );
  headers.append('Content-Type', 'application/json');
  return this._http.post('http://localhost:3000/campaigns/admin-campaigns',{},
  {headers: headers}).map(res=> res.json())
}


publish(_id: any){
  let headers = new Headers();
  headers.append('Authorization',  this._tokenAndUserData.authToken );
  headers.append('Content-Type', 'application/json');
  return this._http.post('http://localhost:3000/campaigns/reviewed',{ "_id":_id, "verified": true},
  {headers: headers}).map(res=> res.json())
}

zakaatEligible(_id: any){
  let headers = new Headers();
  headers.append('Authorization',  this._tokenAndUserData.authToken );
  headers.append('Content-Type', 'application/json');
  return this._http.post('http://localhost:3000/admin/zakaat-status',{ "_id":_id, "zakaatEligible": true},
  {headers: headers}).map(res=> res.json())
  
}









}


