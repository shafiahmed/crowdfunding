import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { Router } from '@angular/router';
import { CampaignService } from './campaign.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-fundraiser',
  templateUrl: './fundraiser-register.component.html',
  styleUrls: ['./fundraiser-register.component.css']
})
export class FundraiserRegisterComponent implements OnInit, OnDestroy {
  campaignService: CampaignService;
  renderPhoneVerificatonComponent: boolean = false;
  flashMessageSubscription: Subscription
  constructor(
    private _authService: AuthserviceService,
    private _router: Router,
    private _campaignService: CampaignService,
    private _flashMessages: FlashMessagesService,
  ) {
    this.campaignService = this._campaignService;
  }

  ngOnInit() {
    window.scroll(0,0)
    this._campaignService.activateStepOne = false;
    this._campaignService.activateStepTwo = false;
    this._campaignService.activateStepThree = false;
    this._campaignService.activateOrganizationDetailsComponent = false;
    this._campaignService.connectSocket()
    console.log('in oninit')
    this._authService.isPhoneRegistered().subscribe((status) => {
      if (status.success) { //checking if phone no is registered with user
        this.renderPhoneVerificatonComponent = false;
        //here we are retrieving saved campaign/fundraiser state if any from the user database        
        this._authService.retrieveCampaignState().subscribe((data) => {
          if (data.state === true) {
            //campaign is saved and was not submitted by user while creation
            //restore this saved campaign to campaign service campaignFormObject
            this._campaignService.campaignFormObject = data.campaignSaved;
            this._flashMessages.show('You have previously unsubmitted fundraiser.', { cssClass: 'alert-success', timeout: 3000 })
          }
          else {
            console.log('state not saved');
          }
        });
        //phone no is registered, therefor no need to activate phone verification form
        //hence activate next form step
        this._campaignService.activateStepOne = true;
      }
      else {
        //if phone no is not registered then activate the phone verification form
        this.renderPhoneVerificatonComponent = true;
      }
    });
  }

  ngOnDestroy() {
    this._campaignService.disconnectSocket()
  }


}
