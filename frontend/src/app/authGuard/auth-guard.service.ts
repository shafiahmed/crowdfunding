import { Injectable, Inject, PLATFORM_ID  } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service'
import { isPlatformBrowser } from '@angular/common';
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private _authService: AuthserviceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  //====================================================================================================
  //     INTERFACE FUNCTION canActivate()
  //     ### if user logged in, the requested route is activated else user is redirected to login page 
  //====================================================================================================
  canActivate() {
    if (this._authService.isLoggedIn()) {
      return true
    } else {
     // this.router.navigate(['/login']); // if the roues which require user to be logged in are accessed, and the user
     if (isPlatformBrowser(this.platformId)) {
      alert('log in first');                                 // is not logged in, the user is redirected to login page.
      return false;
    }
    return false
    }
  }
}
