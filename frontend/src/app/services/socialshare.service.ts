import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable()
export class SocialShareService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }


  sharePost(link){
    if(isPlatformBrowser(this.platformId)){
        var shareLink = link;
        window.open("http://www.facebook.com/sharer/sharer.php?u="+shareLink, "_blank", "resizable=yes,top=300,left=500,width=500,height=400") 
    }
}

}
