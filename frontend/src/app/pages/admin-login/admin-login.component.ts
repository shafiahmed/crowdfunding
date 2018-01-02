import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminGuardService } from '../../authGuard/admin-guard.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  @ViewChild('form') loginData: NgForm;
  @ViewChild('formwrapper') formwrapper : ElementRef;
  constructor(
    private _adminAuthService: AdminAuthService,
    private _router: Router,
    private _guard: AdminGuardService,
    private _flashMessages: FlashMessagesService,
 
  ) { }

  ngOnInit() {
  }

  onLogin() {
    //loginJsonData is to be sent to backend to match login credentials
      let loginJsonData = {
        email: this.loginData.value.email.toLowerCase(),
        password: this.loginData.value.password
      }
      this._adminAuthService.adminLogin(loginJsonData).subscribe(responseData => {  // userLogin defined in Authservice
        if (responseData.success) {
          this._adminAuthService.storeUserData(responseData.token,responseData.adminData.isAdmin) //store UserData defined in Authservice
          this._router.navigate(['/admin/dashboard'])
        }  
        else{
          this._flashMessages.show(responseData.msg, { cssClass: 'alert-danger', timeout: 4000 })
         // alert('Password does not match!')
        }                                                                         // userData contains name , email and _id from DB
      });
    }



}
