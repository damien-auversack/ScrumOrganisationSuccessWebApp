import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SignUpService {
    private _password : string ='';
    private _email : string ='';

    constructor() { }

    get password(): string {
        return this._password;
    }

    get email(): string {
        return this._email;
    }

    reset(){
        this._email='';
        this._password='';
    }

    setValues(psw:string, email:string){
        this._password=psw;
        this._email=email;
    }
}
