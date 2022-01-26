import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-navbar-visitor',
    templateUrl: './navbar-visitor.component.html',
    styleUrls: ['../../../app.component.css', '../navbar.component.css', './navbar-visitor.component.css']
})
export class NavbarVisitorComponent implements OnInit {
    isOpen: boolean = false;

    constructor() { }

    leftMenu = [
        {
            name: "Contact",
            router:"contact"
        },
        {
            name: "Team",
            router:"team"
        }
    ];

    rightMenu = [
        {
            name: "Login",
            router:"login"
        },
        {
            name: "Sign Up",
            router:"signUp"
        }
    ];

    ngOnInit(): void { }

    switchIsOpen() {
        this.isOpen = !this.isOpen;
    }
}
