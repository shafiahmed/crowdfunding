import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  profileData = {}
  username: String;
  userphoto: String;
  constructor(
    private _authService: AuthserviceService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    //===================================================================================
    //  Everytime profile page is loaded, below code extracts profile data from database
    //===================================================================================
    var tokenFromUrl = this._activatedRoute.snapshot.params['token']
    //###################  IF SOCIAL TOKEN IS PRESENT#############
    if (tokenFromUrl) {
      //in case of redirect from facebook/google/linkedin callback from backend
      //send token back to backend for authenticity and receive back the data
      this._authService.socialMediaSignIn(tokenFromUrl).subscribe((userData) => {
        if (userData.success === false) {
          this._router.navigate(['/']);
        }
        else {

          this._authService.storeUserData(tokenFromUrl, userData);
          this.username = userData.profileData.name;
          this.userphoto = userData.profileData.photo;
        }
      });
    }
    //############################################################    
    else {
      this._authService.getProfile().subscribe(userData => {
        if (userData.success) {
          this.username = userData.profileData.name;
          if (userData.profileData.photo) {
            this.userphoto = userData.profileData.photo;
          }
        }
        else {
          this._router.navigate(['/'])
        }
      });
    }

  }
}
