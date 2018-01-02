import { Component, OnInit, OnDestroy } from '@angular/core';
import { FundraiserLoadService } from '../../../services/fundraiser-load.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs/Subscription'
@Component({
  selector: 'app-all-fundraisers',
  templateUrl: './all-fundraisers.component.html',
  styleUrls: ['./all-fundraisers.component.css']
})
export class AllFundraisersComponent implements OnInit, OnDestroy {
  tsrLoadSubscr: Subscription
  teaserDataArray: object[]
  constructor(
    private _frLoadService: FundraiserLoadService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
     //get the fundraisers from service and assign to teaserDataArray
     this.tsrLoadSubscr = this._frLoadService.loadFrTeasers().subscribe((data) => {
      if (data.success) {
        this.teaserDataArray = data.teaserData;
      }
    })
  }

  ngOnDestroy() {
    this.tsrLoadSubscr.unsubscribe()
  }

}
