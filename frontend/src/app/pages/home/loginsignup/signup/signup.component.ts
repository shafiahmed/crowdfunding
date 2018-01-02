import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages'
import { AuthserviceService } from '../../../../services/authservice.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  success: boolean = true;
  message: any;
  passwordStatus: any;
  passwordTyped='';
  @ViewChild('f') userData: NgForm
  constructor(
    private _authService: AuthserviceService,
    private _router: Router,
    private _flashMessagesService: FlashMessagesService
  ) { }


  ngOnInit() {

  }
  //============================
  //    when form is submitted
  //============================
  onSubmit() {
    if(this.passwordTyped.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
    {
      let jsonData = {
        name: this.userData.value.name,
        email: this.userData.value.email.toLowerCase(),
        password: this.userData.value.password
      }
      this._authService.registerUser(jsonData).subscribe(responseData => {
        if (responseData.success) {
          this._flashMessagesService.show('Successfully created account!',{ cssClass: 'alert-success', timeout: 4000 })        
        }
        else {
          this.success = false;
          this.message = responseData.msg;
        }
      }); 
    }
    else{
      this.passwordStatus ='Password must contain atleast 8 chracters,one uppercase ,one lowercase character and one number'
    }
    
  }

}
