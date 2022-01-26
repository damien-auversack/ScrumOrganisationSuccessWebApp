import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-navbar-scrum-master',
    templateUrl: './navbar-scrum-master.component.html',
    styleUrls: ['./navbar-scrum-master.component.css']
})

export class NavbarScrumMasterComponent implements OnInit {
    userType:string = "ScrumMaster";

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
            name: "ScrumMaster",
            router:""
        }
    ];

    constructor() { }

    ngOnInit(): void { }
}
