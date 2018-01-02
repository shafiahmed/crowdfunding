import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CampaignService } from '../campaign.service';
import { NgForm } from '@angular/forms'
import { AuthserviceService } from '../../../services/authservice.service'
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent implements OnInit {
  @ViewChild('f') formbject: NgForm;
  @ViewChild('fileInput') inputEl: ElementRef;
  @ViewChild('inputData') inputDate: ElementRef;
  message: String;
  campaignService: CampaignService;
  submitButtonDisabled: boolean = true;
  uploadButtonDisabled: boolean = false;
  uploadCount = 1;
  imagePath: string;
  isImage: boolean = true
  index = 0;
  typed_fr_name: string;
  fundraiserNameMatched: boolean = false;
  containsSpecialCharacter: boolean = false;
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthserviceService,
    public _campaignService: CampaignService,
    private _http: Http,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.campaignService = this._campaignService;
  }

  ngOnInit() {
    this.typed_fr_name = this._campaignService.campaignFormObject.fundraiserName;
    this.imagePath = this._campaignService.campaignFormObject.imagePath[0];
  }



  //===========================================================================================
  //                                    UPLOAD CAMPAIGN IMAGE
  //==========================================================================================
  //Notes: 
  //      # In this upload function the image is choosen one at a time of the total of 3 images
  //      # when each time upload is clicked, the images is uploaded to server and the file path is constructed
  //        along with the file name and sent back to the frontend "campaign service" to store image url in formData 
  //        object.
  //      # After uploading desired no of images the user needs to click submit.

  uploadImage() {
    if (this.imagePath) {
      console.log('image is there');
      this.deleteImage()
    }
    var inputEl: HTMLInputElement = this.inputEl.nativeElement;
    let fileCount: number = inputEl.files.length;
    let formData = new FormData();
    if (fileCount === 1) { // a file was selected
      //for (let i = 0; i < fileCount; i++) {
      //  formData.append('file[]', inputEl.files.item(i));}
      formData.append('fundraiser-image', inputEl.files.item(0));
      this.campaignService.uploadImage(formData).subscribe(fileDetails => {
        console.log(fileDetails.filePath);
        if (fileDetails.success) {// if file is uploaded successfully
          inputEl.value = null;//trick to make file input select same file again after deleting
          this._campaignService.campaignFormObject.imagePath[0] = fileDetails.filePath;//filepath received from backend, it will bes stored in db
          this.message = fileDetails.msg; // display message on form
          this.imagePath = this._campaignService.campaignFormObject.imagePath[0];
          //here we disable upload button if maximum allowed images reached
        } else {
          this.message = fileDetails.msg;
        }
      });
    }

  }

  deleteImage() {
    let imagePath = this._campaignService.campaignFormObject.imagePath[0]
    this._campaignService.deleteImage(imagePath).subscribe((data) => {
      console.log(data)
      if (data.success) {
        this._campaignService.campaignFormObject.imagePath = []
        this.imagePath = null
      }
    })
  }


  checkImageType(event) {
    let inputEl: HTMLInputElement = this.inputEl.nativeElement;
    if (event.target.files[0].type === 'image/jpeg') {
      console.log(event.target.files[0])
    }
  }


  checkUniqueFundraiserName(event) {

    //##implement stripping of special characters and space 
    if (event.key !== ' ') {
      if (this.typed_fr_name.match(/[@!#\\$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g)) {
        this.containsSpecialCharacter = true;
      }
      else {
        this.containsSpecialCharacter = false;
        this._campaignService.checkUniqueFundraiserName(this.typed_fr_name).subscribe((status) => {
          if (status.success) {
            this.fundraiserNameMatched = true;
          }
          else {
            this.fundraiserNameMatched = false;
          }
        })
      }
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

  stepThree() {
    if (this.containsSpecialCharacter === true || this.fundraiserNameMatched === true) {
      console.log('please fill the fields with appropriate content');
      if (isPlatformBrowser(this.platformId)) {
        alert('please fill the appropriate fundraiser name')
      }
    }
    if (this._campaignService.campaignFormObject.imagePath.length == 0) {
      console.log('please fill the fields with appropriate content');
      if (isPlatformBrowser(this.platformId)) {
        alert('Please select one fundraiser image')
      }
    }
    else {
      this._campaignService.campaignFormObject.fundraiserName = this.typed_fr_name;
      if (this.formbject.touched) {
        console.log('touched')
        this._authService.saveCampaignState(this.campaignService.campaignFormObject).subscribe((data) => {
          console.log(data)
        })
      }

      this._campaignService.activateStepTwo = false;
      console.log(this._campaignService.campaignFormObject.baneficiaryType)
      if (this._campaignService.campaignFormObject.baneficiaryType === 'registered-ngo') {
        this._campaignService.activateOrganizationDetailsComponent = true
      }
      else {
        this._campaignService.activateStepThree = true;
      }

    }

  }

  previous() {
    this._campaignService.activateStepTwo = false;
    this._campaignService.activateStepOne = true
  }
}
