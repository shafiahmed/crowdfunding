import { Component, OnInit, ViewChild,ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CampaignService } from '../campaign.service';
import { AuthserviceService } from '../../../services/authservice.service';
import { DataValidationService } from '../../../services/data-validation.service'
@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent implements OnInit {
  @ViewChild('f') formbject: NgForm;
  @ViewChild('#canvas') canvas;
  campaignService: CampaignService;
  isAmountAcceptable: boolean = true;
  isNameValidated: boolean = true;
  isBeneficaiaryNameValidated: boolean = true;
  constructor(
    private _router: Router,
    private activeRoute: ActivatedRoute,
    public _campaignService: CampaignService,
    private _authService: AuthserviceService,
    private _dataValidationService: DataValidationService
  ) {
    this.campaignService = this._campaignService
  }

  ngOnInit() {

console.log(this.canvas)
  }


  //==========================================================================
  //==========================================================================
  destroyCampaignState() {
    this._authService.destroyCampaignState().subscribe((status) => {
      console.log(status)
      if (status.success) {
        this._campaignService.reinitializeCampaignData();
        this._router.navigate(['/'])
      }
    })
  }
  //==========================================================================
  //==========================================================================
  checkMinFundraiserAmount(event) {
    console.log('reached')
    if (Number(this.campaignService.campaignFormObject.amountToRaise) < 10000) {
      this.isAmountAcceptable = false;
    }
    else {
      this.isAmountAcceptable = true;
    }
  }


  validateName(event) {
    this.isNameValidated = this._dataValidationService.validateName(this.campaignService.campaignFormObject.startedBy);
  }
  validateBeneficiaryName(event) {
    this.isBeneficaiaryNameValidated = this._dataValidationService.validateName(this.campaignService.campaignFormObject.beneficiaryName);
  }


  //==========================================================================
  //==========================================================================
  stepTwo() {
    if (this.isAmountAcceptable && this.isNameValidated && this.isBeneficaiaryNameValidated) {
      if (this.formbject.touched) {
        this._authService.saveCampaignState(this.campaignService.campaignFormObject).subscribe((data) => {
          console.log(data)
        })
      }
      this._campaignService.activateStepOne = false;
      this._campaignService.activateStepTwo = true;
    }
    else {
//show a modal window
console.log('please fill the appropriate field')
    }
  }
}

//_campaignService's campaignFormObject data is directly set in the html template by [(ngMoldel)] 