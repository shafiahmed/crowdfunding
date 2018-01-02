import {
  Component,
  OnInit, ViewChild,
  ElementRef,
  Renderer2,
  Inject,
  PLATFORM_ID,
  AfterViewInit
} from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { SeoService } from '../../services/seo.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'
import { FundraiserLoadService } from '../../services/fundraiser-load.service';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
@ViewChild('trending') trending: ElementRef

  tsrLoadSubscr: Subscription
  teaserDataArray: object[]
  //topCampaignArray stores the campaign data object returned from database query which is used to iterate over the 
  //homepage display of running campaigns teaser thumbnails.
  topCampaignArray: object[];
  dataReceived: boolean = false;
  bannerFeaturedFr: any;

  constructor(
    private _generalService: GeneralService,
    private _seo: SeoService,
    private _renderer2: Renderer2,
    private _frLoadService: FundraiserLoadService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  ngOnInit() {
    window.scroll(0, 0)
    this._seo.generateTags({
      title: 'Home',
      image: 'https://malcoded.com/media/images/Angular-Universal.png/webp/1024',
      site_name: 'Ebtida',
      description: 'This is description for testing purpose'
    });
    /*if (isPlatformBrowser(this.platformId)) {
      window.open("http://www.facebook.com/sharer/sharer.php", "_blank", "resizable=yes,top=300,left=500,width=500,height=400")
    }*/
    this._generalService.loadTopCampaigns().subscribe(campaignsReceivedFromDB => {
      this.topCampaignArray = campaignsReceivedFromDB
      this.dataReceived = true;
    })

    //get the fundraisers from service and assign to teaserDataArray
    this._frLoadService.loadFrTeasers().subscribe((data) => {
      if (data.success) {
        console.log(data.teaserData)
        this.teaserDataArray = data.teaserData;
      }
    })
  }


  ngAfterViewInit(){

  }


}
