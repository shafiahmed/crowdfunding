import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthserviceService } from '../../../../services/authservice.service';
import { AuthGuardService } from '../../../../authGuard/auth-guard.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { SocialShareService } from '../../../../services/socialshare.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('f') loginData: NgForm;
  @ViewChild('formwrapper') formwrapper : ElementRef;

  constructor(
    private _authService: AuthserviceService,
    private _router: Router,
    private _guard: AuthGuardService,
    private _flashMessages: FlashMessagesService,
    private _socialShare: SocialShareService
  ) { }

  onLogin() {
    //loginJsonData is to be sent to backend to match login credentials
      let loginJsonData = {
        email: this.loginData.value.email.toLowerCase(),
        password: this.loginData.value.password
      }
      this._authService.userLogin(loginJsonData).subscribe(responseData => {  // userLogin defined in Authservice
        if (responseData.success) {
          console.log(responseData.userData);
          this._authService.storeUserData(responseData.token,responseData.userData) //store UserData defined in Authservice
          this._router.navigate(['/profile']);
         
        }  
        else{
          this._flashMessages.show(responseData.msg, { cssClass: 'alert-danger', timeout: 4000 })
         // alert('Password does not match!')
        }                                                                         // userData contains name , email and _id from DB
      });
    }



  ngOnInit() {
  
  }


share(){
  this._socialShare.sharePost('https://milaap.org/fundraisers/saveanimalsindia');
}



}
