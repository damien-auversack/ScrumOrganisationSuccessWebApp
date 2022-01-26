import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['../../../app.component.css', './contact.component.css']
})
export class ContactComponent implements OnInit {
    title:string = "Contact Us";
    contactMail:string = "support@gmail.com";

    imgsSocialNetwork:any = [
        {
            img: "linkedin"
        },
        {
            img: "facebook"
        },
        {
            img: "twitter"
        }
    ];

    constructor() { }

    ngOnInit(): void { }
}
