import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { AdminAuthService } from '../services/admin-auth.service'
import { FlashMessagesService } from 'angular2-flash-messages';
import * as $ from 'jquery';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authService: any;
  profilePhoto: any;
  name: String;
  adminAuthService: AdminAuthService
  constructor(
    private _router: Router,
    public _authService: AuthserviceService,
    private _adminAuthService: AdminAuthService,
    private _flashMessages: FlashMessagesService
  ) {
    this.adminAuthService = this._adminAuthService
  }

  ngOnInit() {
    this.authService = this._authService;
  }

  //========================================================
  //   logOut() function defined in services/authService.ts
  //========================================================
  logUserOut() {
    this._authService.logOut();
    this._router.navigate(['/']);
  }

}
