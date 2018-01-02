import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { AuthserviceService } from '../../services/authservice.service';
import { TokenAndUserData } from '../../services/token-and-user-data'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';

@Injectable()
export class CampaignService {
  campaignFormObject = {
    phone: '',                 //========Phone no is only stored on user schema in DB not in campaign schema
    startedBy: '',
    title: '',
    category: '',
    beneficiaryName: '',
    baneficiaryType: '',
    organizationName: '',      // ====== only in case of registered NGO
    organizationWebsite: '',   // ====== only in case of registered NGO
    pan: '',                   // ====== only in case of registered NGO
    taxStatus: '',             // ====== only in case of registered NGO
    fundraiserName: '',
    amountToRaise: '',
    story: '',
    city: '',
    video: '',
    imagePath: [],
    documentPath: [],
    bankName: '',
    accName: '',
    accNo: '',
    ifsc: ''
  }
  //the topCampaigns array stores topCampaign for gallery, on home page and only refreshes campaigns from DB when app relodes
  //used in home component.
  topCampaigns: Array<Object>;
  socket: any
  //below variables are used to enable different states of the fundraiser/campaign registration form
  activatePhoneVerifyForm: boolean = true;
  activateStepOne: boolean = false;
  activateStepTwo: boolean = false;
  activateStepThree: boolean = false;
  activateOrganizationDetailsComponent: boolean = false;
  constructor(
    private _authService: AuthserviceService,
    private _tokenAndUserData: TokenAndUserData,
    private _http: Http,
    private _router: Router
  ) {

  }

  submitCampaignToDb() {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this._tokenAndUserData.authToken);
    return this._http.post('http://localhost:3000/campaigns/register', this.campaignFormObject, { headers: headers }).map(res => res.json());
  }

  connectSocket() {
    this.socket = io('http://localhost:3000');
  }

  disconnectSocket() {
    this.socket.disconnect()
  }
  sendOtp(phone: any): Subject<any> { // this method used in verifyphone component
    console.log(phone);
    let phoneVerificationSubject = new Subject<any>();
    this.socket.emit('verify-number', phone)
    this.socket.on('isPhoneNoCorrect', (status) => {
      console.log(status);
      phoneVerificationSubject.next(status);
    });
    return phoneVerificationSubject
  }

  verifyOtp(otp: any): Subject<any> {// this method used in verifyphone component
    let otpVerificationSubject = new Subject<any>();
    this.socket.emit('verify-otp', otp, this._tokenAndUserData.authToken);
    this.socket.on('isOtpCorrect', (status) => {
      otpVerificationSubject.next(status);
    });
    return otpVerificationSubject;
  }

  checkUniqueFundraiserName(name) { // this method is used in step-two component
    let frNameCheckSubject = new Subject<any>();
    this.socket.emit('check-name', name);
    this.socket.on('check-name-status', (status) => {
      frNameCheckSubject.next(status)
    });
    return frNameCheckSubject;
  }

  uploadImage(formData: FormData) {
    let headers = new Headers()
    headers.append('Authorization', this._tokenAndUserData.authToken);
    return this._http.post('http://localhost:3000/campaigns/upload-image', formData, { headers: headers }).map(res => res.json())
  }

  deleteImage(imagePath) {
    console.log('reachedd')
    let headers = new Headers()
    headers.append('Authorization', this._tokenAndUserData.authToken);
    headers.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/campaigns/delete-image', { imagePath: imagePath }, { headers: headers }).map(res => res.json())
  }


  deleteDoc(docPath, doc_id) {
    let headers = new Headers()
    headers.append('Authorization', this._tokenAndUserData.authToken);
    headers.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/campaigns/delete-document',
      { docPath: docPath, doc_id: doc_id }, { headers: headers }).map(res => res.json())
  }


  //reinitialize campaign data
  // this method is triggered in stepThree when form is submitted
  //this is used to reset form for new registration
  reinitializeCampaignData() {

    this.campaignFormObject = {
      phone: '',
      startedBy: '',
      title: '',
      category: '',
      beneficiaryName: '',
      baneficiaryType: '',
      organizationName: '',
      organizationWebsite: '',
      pan: '',
      taxStatus: '',
      fundraiserName: '',
      amountToRaise: '',
      story: '',
      city: '',
      video: '',
      imagePath: [],
      documentPath: [],
      bankName: '',
      accName: '',
      accNo: '',
      ifsc: ''
    }
    this.activatePhoneVerifyForm = true;
    this.activateStepOne = false;
    this.activateStepTwo = false;
    this.activateStepThree = false;
  }
}
