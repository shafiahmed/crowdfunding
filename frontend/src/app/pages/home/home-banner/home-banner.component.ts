import { Component, OnInit, Input } from '@angular/core';
import { FundraiserLoadService } from '../../../services/fundraiser-load.service'
@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {
  featuredFr: any;

  constructor(
    private _fundraiserLoadService: FundraiserLoadService
  ) { }

  ngOnInit() {
    this._fundraiserLoadService.loadFeaturedBanner().subscribe(receivedObject => {
      if(receivedObject.success){
        console.log(receivedObject)
     this.featuredFr = receivedObject.featuredFrObject

      }
      
     })
  }

}
