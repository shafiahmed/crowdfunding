import { Injectable } from '@angular/core';

@Injectable()
export class DataValidationService {

  constructor() { }

  //only (-) &(.) special characters are allowed in a name beside alphabets.
  validateName(nameTyped): boolean {
    //   /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi all special characters regex
    if (nameTyped.match(/[`~!@#$%^&*()_|+\=?;:'",<>\{\}\[\]\\\/]/gi)) {
      return false;
    }
    else {
      return true;
    }
  }

  isRequiredInputEmpty(input: any): boolean {
    if (input.match(/^\s+$|^$/gi)) {
      console.log('null');
      return true;
    }
    else {
      console.log('not null')
      return false
    }
  }

}
