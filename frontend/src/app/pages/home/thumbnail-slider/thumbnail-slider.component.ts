import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-thumbnail-slider',
  templateUrl: './thumbnail-slider.component.html',
  styleUrls: ['./thumbnail-slider.component.css']
})
export class ThumbnailSliderComponent implements OnInit {




  thumbnailData_two = [
    { 'desc': 'Help the Ramakrishna Mission children buy tablets!', 'src': './assets/3.jpeg' },
    { 'desc': 'At Latika Roy Foundation, we believe that when we plan for the vulnerable,', 'src': './assets/1.jpeg' },
    { 'desc': 'This an endeavor to provide 1,000+ water filters ', 'src': './assets/4.png' },
    { 'desc': 'Help Pradnya Produce India First Series of Animated Sanskrit Rhymes', 'src': './assets/2.jpg' }
  ];

  constructor() { }

  ngOnInit() {

  }

}
