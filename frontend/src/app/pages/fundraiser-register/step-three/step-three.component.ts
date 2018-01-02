import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CampaignService } from '../campaign.service';
import { AuthserviceService } from '../../../services/authservice.service';
import { DataValidationService } from '../../../services/data-validation.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { TokenAndUserData } from '../../../services/token-and-user-data'
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.css']
})
export class StepThreeComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') inputEl: ElementRef;
  @ViewChild('inputData') inputDate: ElementRef;
  @ViewChild('docCaption') docCaption: ElementRef;
  @ViewChild('docModal') docModal: ElementRef;
  @ViewChild('modalCloseBtn') modalCloseBtn: ElementRef;
  @ViewChild('fileNamePlaceholder') fileNamePlaceholder: ElementRef
  fileNameSubscription: Subscription
  campaignService: CampaignService;
  message: String;
  submitButtonDisabled: boolean = true;
  uploadButtonDisabled: boolean = false;
  uploadCount = 1;
  documentUrl: String = this._campaignService.campaignFormObject.documentPath[0];
  index = 0;
  isCaptionValid: boolean = true  //document upload caption
  captionCharactersLeft: number
  inputFileName: string;
  constructor(
    private _campaignService: CampaignService,
    private _authService: AuthserviceService,
    private _tokenAndUserData: TokenAndUserData,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _dataValidationService: DataValidationService,
    private _renderer2: Renderer2,
    private _http: Http
  ) {
    this.campaignService = this._campaignService;
  }

  ngOnInit() {
    this.captionCharactersLeft = 70;
  }

  ngOnDestroy() {

  }
  // for document caption
  keyPressValidation(event) {
    this.captionCharactersLeft = 70 - this.docCaption.nativeElement.value.length;
    if (this.isRequiredInputEmpty(this.docCaption.nativeElement.value)) {
      this._renderer2.setStyle(this.docCaption.nativeElement, "border-color", "red");
      this.isCaptionValid = false
    }
    else {
      this._renderer2.setStyle(this.docCaption.nativeElement, "border-color", "");
      this.isCaptionValid = true;
    }
  }

  isRequiredInputEmpty(input: any): boolean {
    return this._dataValidationService.isRequiredInputEmpty(input);
  }

  //===========================================================================================
  //                                    UPLOAD FUNDRAISER DOCUMENTS
  //==========================================================================================
  //Notes: 
  //      # In this upload function the document is choosen one at a time.


  uploadDoc() {
    var inputEl: HTMLInputElement = this.inputEl.nativeElement;
    var fileCount: number = inputEl.files.length;
    if (this.isRequiredInputEmpty(this.docCaption.nativeElement.value)) {
      this._renderer2.setStyle(this.docCaption.nativeElement, "border-color", "red");
      this.isCaptionValid = false

    }
    if (fileCount != 1) {
      this._renderer2.setStyle(this.fileNamePlaceholder.nativeElement, "border-color", "red");
    }
    else {
      this._renderer2.setStyle(this.fileNamePlaceholder.nativeElement, "border-color", "");
      let formData = new FormData();
      if (fileCount === 1) { // a file was selected
        //for (let i = 0; i < fileCount; i++) {
        //    formData.append('file[]', inputEl.files.item(i));
        //}
        formData.append('fundraiser-document', inputEl.files.item(0));
        {
          let headers = new Headers()
          headers.append('Authorization', this._tokenAndUserData.authToken);
          this._http.post('http://localhost:3000/campaigns/upload-document/' +
            this.docCaption.nativeElement.value, formData, { headers: headers }).map(res => res.json()).subscribe(fileDetails => {
              console.log(fileDetails)
              if (fileDetails.success) {
                this._campaignService.campaignFormObject.documentPath = fileDetails.documentPath //filepath received from backend, it will bes stored in db
                this.docCaption.nativeElement.value = '';
                this.inputEl.nativeElement.value = null;
                this.modalCloseBtn.nativeElement.click();
              }
            });
        }
      }
    }
  }


  deleteDoc(docPath, doc_id) {
    this._campaignService.deleteDoc(docPath, doc_id).subscribe((data) => {
      if (data.success) {
        this._campaignService.campaignFormObject.documentPath = data.documentPath;
        console.log(this._campaignService.campaignFormObject.documentPath)
      }
    });
  }


  submitCampaign() {
    console.log(this._campaignService.campaignFormObject)
    if (this._authService.isLoggedIn()) {
      this._campaignService.submitCampaignToDb().subscribe(responseData => {
        console.log(responseData);
        this._campaignService.reinitializeCampaignData();
        this._router.navigate(['/'])
      });
    } else {
      this._router.navigate(['/']);
    }
  }
  destroyCampaignState() {
    this._authService.destroyCampaignState().subscribe((status) => {
      console.log(status)
      if (status.success) {
        this._campaignService.reinitializeCampaignData();
        this._router.navigate(['/'])
      }
    })
  }



  previous() {
    if (this.campaignService.campaignFormObject.baneficiaryType === 'registered-ngo') {
      this._campaignService.activateStepThree = false;
      this._campaignService.activateOrganizationDetailsComponent = true
    } else {
      this._campaignService.activateStepThree = false;
      this._campaignService.activateStepTwo = true
    }

  }
}