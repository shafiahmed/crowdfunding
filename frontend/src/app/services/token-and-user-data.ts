import { Injectable } from '@angular/core'

@Injectable()
export class TokenAndUserData {
    authToken: string;
    isAdmin: boolean;
    userData: object
}