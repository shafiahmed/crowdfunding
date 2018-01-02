import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class FundraiserLoadService {

  constructor(
    private _http: Http
  ) { }


  loadFrTeasers() {
    return this._http.get('http://localhost:3000/campaigns/load-teaser').map(res => res.json());
  }

  getFrProfile(frName){
    return this._http.get('http://localhost:3000/campaigns/load-fr-profile/'+frName).map(res=>res.json())
  }

  loadFeaturedBanner(){
    return this._http.get('http://localhost:3000/campaigns/featured-banner').map(res => res.json())
  }

}
