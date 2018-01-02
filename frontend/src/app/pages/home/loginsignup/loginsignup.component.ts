import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-loginsignup',
  templateUrl: './loginsignup.component.html',
  styleUrls: ['./loginsignup.component.css']
})
export class LoginsignupComponent implements OnInit {
loginActive:boolean= true;
signupActive: boolean =false;

  constructor() { }

  ngOnInit() {
  }
  activeLogin(){
    this.loginActive = true;
    this.signupActive = false;
  }
  activeSignup(){
    this.loginActive = false;
    this.signupActive = true;
  }
}
