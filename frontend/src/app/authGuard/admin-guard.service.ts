import { Injectable, Inject, PLATFORM_ID  } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service'
import { isPlatformBrowser } from '@angular/common';
@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(
    private _adminAuthService: AdminAuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    
   }

  //====================================================================================================
  //     INTERFACE FUNCTION canActivate()
  //     ### if admin logged in, the requested route is activated else user is redirected to admin page 
  //====================================================================================================
  canActivate() {
    if (this._adminAuthService.isLoggedIn()) {
      return true
    } else {
      this.router.navigate(['/admin']); 
 
    }
  }
}
