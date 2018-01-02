import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fr-tiles',
  templateUrl: './fr-tiles.component.html',
  styleUrls: ['./fr-tiles.component.css']
})
export class FrTilesComponent implements OnInit {
  progBarPerc :number;
  @Input('teaserData') teaserData: {
    'imagePath': string[],
    'amountRaised': any,
    'amountToRaise': number,
    'category': string,
    'title': string,
    'daysLeft': number,
    'fundraiserName':string,
    'startedBy': string
  }
  
  constructor() { }

  ngOnInit() {
    console.log(this.teaserData)
    this.progBarPerc = (this.teaserData.amountRaised/this.teaserData.amountToRaise)*100;
    this.teaserData.amountRaised = this.teaserData.amountRaised.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

}
