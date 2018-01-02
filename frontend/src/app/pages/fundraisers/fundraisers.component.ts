import { Component, OnInit, OnDestroy } from '@angular/core';
import { FundraiserLoadService } from '../../services/fundraiser-load.service'
import { Subscription } from 'rxjs/Subscription'
@Component({
  selector: 'app-fundraisers',
  templateUrl: './fundraisers.component.html',
  styleUrls: ['./fundraisers.component.css']
})
export class FundraisersComponent implements OnInit, OnDestroy {
  tsrLoadSubscr: Subscription
  teaserDataArray: object[]

  constructor(
    private _frLoadService: FundraiserLoadService,
  ) { }

  ngOnInit() {
    window.scroll(0,0)
  }


  ngOnDestroy() {
   
  }




}