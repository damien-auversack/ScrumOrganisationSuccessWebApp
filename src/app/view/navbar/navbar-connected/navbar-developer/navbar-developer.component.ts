import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-navbar-developer',
    templateUrl: './navbar-developer.component.html',
    styleUrls: ['../../../../app.component.css', '../../navbar.component.css', './navbar-developer.component.css']
})
export class NavbarDeveloperComponent implements OnInit {
    userType:string = "Developer";

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
            name: "Join Project",
            router:"joinProject"
        }
    ];

    rightMenu = [
        {
            img: "",
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
            name: "Developer",
            router:""
        }
    ];

    constructor() { }

    ngOnInit(): void { }
}
