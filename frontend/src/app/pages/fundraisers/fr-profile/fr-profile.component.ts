import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FundraiserLoadService } from '../../../services/fundraiser-load.service'
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable'
@Component({
  selector: 'app-fr-profile',
  templateUrl: './fr-profile.component.html',
  styleUrls: ['./fr-profile.component.css']
})
export class FrProfileComponent implements OnInit {
  responseData: Observable<object>;
  frLoadProfSubscr: Subscription;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _frLoadService: FundraiserLoadService
  ) { }

  ngOnInit() {
   let frName = this._activatedRoute.snapshot.params['frname']
   this.responseData = this._frLoadService.getFrProfile(frName)
  }

}
