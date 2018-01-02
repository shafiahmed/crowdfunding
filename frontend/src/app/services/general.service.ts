import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class GeneralService {


  constructor(private _http: Http) {
  


  }

  loadTopCampaigns(){
    return this._http.get('http://localhost:3000/campaigns/topcampaigns').map(res => res.json())
    //return this._http.get('http://107.20.93.175/campaigns/topcampaigns').map(res => res.json())
  
  }

}
