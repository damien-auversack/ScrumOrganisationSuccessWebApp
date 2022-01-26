import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-navbar-product-owner',
    templateUrl: './navbar-product-owner.component.html',
    styleUrls: ['./navbar-product-owner.component.css']
})

export class NavbarProductOwnerComponent implements OnInit {
    userType:string = "ProductOwner";

    logo = {
        img: "sos_logo.png",
        router: "today"
    };

    leftMenu = [
        {
            name: "Projects",
            router:"projectManager"
        },
        {
            name: "Meetings",
            router:"meetings"
        },
        {
            name: "Users Request",
            router:"usersRequest"
        }
    ];

    rightMenu = [
        {
            img: "anonym.png",
            name: "",
            router:"profile"
        },
        {
            img: "bell.png",
            name: "",
            router:"notification"
        },
        {
            img: "",
            name: "ProductOwner",
            router:""
        }
    ];

    constructor() { }

    ngOnInit(): void { }
}
