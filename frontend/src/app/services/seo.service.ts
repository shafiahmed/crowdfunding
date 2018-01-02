import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
@Injectable()
export class SeoService {

  constructor(private meta: Meta,private _title: Title) { }

  generateTags(config){
    
  this.meta.updateTag({property: 'og:title', content:config.title });
  this.meta.updateTag({property: 'og:image', content:config.image });
  this.meta.updateTag({property: 'og:site_name', content:config.site_name });
  this.meta.updateTag({property: 'og:description', content:config.description });
  this._title.setTitle('Home');
  }


}
