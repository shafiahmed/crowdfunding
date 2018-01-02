import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fundraiser-teaser',
  templateUrl: './fundraiser-teaser.component.html',
  styleUrls: ['./fundraiser-teaser.component.css']
})
export class FundraiserTeaserComponent implements OnInit {
  progBarPerc :number;
@Input('teaserData') teaserData: {
  'imagePath': string,
  'amountRaised': number,
  'amountToRaise': number,
  'title': string,
  'daysLeft': number,
  'fundraiserName':string,
  'startedBy': string
}


  constructor() { }

  ngOnInit() {
this.progBarPerc = (this.teaserData.amountRaised/this.teaserData.amountToRaise)*100;
  }

}
