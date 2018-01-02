import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../campaign.service';
import { AuthserviceService } from '../../../services/authservice.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {
campaignService :CampaignService
  constructor(
    private _campaignService: CampaignService,
    private _router: Router,
    private _authService: AuthserviceService
  ) {
    this.campaignService = this._campaignService
  }

  ngOnInit() {
  }

  destroyCampaignState(){
    this._authService.destroyCampaignState().subscribe((status)=>{
      console.log(status)
      if(status.success){
        this._campaignService.reinitializeCampaignData();
        this._router.navigate(['/'])
      }
    })
  }

  
  lastStep(){
    this._authService.saveCampaignState(this.campaignService.campaignFormObject).subscribe((data)=>{
      console.log(data)
    })
this.campaignService.activateOrganizationDetailsComponent = false;
this.campaignService.activateStepThree = true;
  }
  previous(){
    this.campaignService.activateOrganizationDetailsComponent = false;
    this.campaignService.activateStepTwo = true;
  }
}
