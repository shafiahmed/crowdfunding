import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CampaignService } from '../campaign.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-verifyphone',
  templateUrl: './verifyphone.component.html',
  styleUrls: ['./verifyphone.component.css']
})
export class VerifyphoneComponent implements OnInit{
  @ViewChild('phoneF') phoneFormObject: NgForm
  @ViewChild('otpF') otpFormObject: NgForm;
  phoneVerificationSubscription: Subscription;
  otpVerificationSubscription: Subscription;
  campaignService: CampaignService;
  otpSentSuccess: boolean = false;
  otpSentStatusMessage: String = '';
  otpVerificationSuccess: boolean = false;
  otpIncorrect: boolean = false;
  otpVerificationStatusMessage: String = '';
  otpCounter: String;
  constructor(
    private _router: Router,
    private activeRoute: ActivatedRoute,
    private _campaignService: CampaignService,
    private _renderer2: Renderer2,
    private _el: ElementRef
  ) {
    this.campaignService = _campaignService;
  }

  ngOnInit() {
   
  }


  sendOtp() {
    let formattedPhone = '+91' + this.phoneFormObject.value.phone
    this.phoneVerificationSubscription = this.campaignService.sendOtp(formattedPhone).subscribe(status => {
     this.otpSentSuccess = status.success;
      this.otpSentStatusMessage = status.msg;
  })
     /*this.otpSentSuccess = true*/
  }

  verifyOtp() {
    this.phoneVerificationSubscription.unsubscribe();//unsubscribe the verifyPhone observable.
     let otpReceived = this.otpFormObject.value.otp_digit_1.toString()+
     this.otpFormObject.value.otp_digit_2.toString()+
     this.otpFormObject.value.otp_digit_3.toString()+
     this.otpFormObject.value.otp_digit_4.toString();
     this.campaignService.verifyOtp(otpReceived).subscribe(status =>{
       this.otpVerificationSuccess = status.success;
       this.otpIncorrect = !status.success;
       this.otpVerificationStatusMessage = status.msg;
       if(this.otpVerificationSuccess){
        this._campaignService.activatePhoneVerifyForm = false;
        this._campaignService.activateStepOne = true
       }
     }) /*
    this._campaignService.activatePhoneVerifyForm = false;
    this._campaignService.activateStepOne = true;*/
  }

  moveNextDigit(input, sec) {
    if (input.key >= 0 && input.key <= 9) {
      sec.focus()
    }
    //this._renderer2.parentNode(this._el.nativeElement).focus();
  }


}
