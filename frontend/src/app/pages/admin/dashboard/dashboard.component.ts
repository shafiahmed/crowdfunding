import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../../../services/admin-auth.service'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  fundraisersArray: object[];
  constructor(
    private _adminAuthService: AdminAuthService
  ) { }

  ngOnInit() {
    this._adminAuthService.loadFundraisers().subscribe((receivedObj) => {
      if (receivedObj.success) {
        this.fundraisersArray = receivedObj.fundraisersArray
        console.log(this.fundraisersArray)
      }
    })
  }



  publish(_id: any,fr: any){
    this._adminAuthService.publish(_id).subscribe((data)=>{
     
    })
  }

  zakaatEligible(_id: any, fr: any){
    this._adminAuthService.zakaatEligible(_id).subscribe((data)=>{
      
    })
  }

}
