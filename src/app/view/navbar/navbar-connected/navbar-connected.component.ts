import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../services";
import {Router} from "@angular/router";
import {SosUser} from "../../../domain/sos-user";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-navbar-connected',
    templateUrl: './navbar-connected.component.html',
    styleUrls: ['./navbar-connected.component.css', '../../../app.component.css', '../navbar.component.css']
})

export class NavbarConnectedComponent implements OnInit, OnDestroy {
    isOpen:boolean = false;

    @Input()
    userType:string = "";

    @Input()
    logo = {
        img: "",
        router: ""
    }

    @Input()
    leftMenu = [
        {
            name: "",
            router:""
        },
        {
            name: "",
            router:""
        }
    ]

    @Input()
    rightMenu = [
        {
            img: "",
            name: "",
            router:""
        },
        {
            img: "",
            name: "",
            router:""
        },
        {
            img: "",
            name: "",
            router:""
        }
    ]
    private subscription: Subscription | undefined;

    constructor(private authenticationService: AuthenticationService,
                private router : Router) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription = this.authenticationService.currentUser.subscribe(user => this.changeName(user));
    }

    switchIsOpen() {
        this.isOpen = !this.isOpen;
    }
    logOut() {
        this.authenticationService.logout();
        this.router.navigate(["login"]);
    }

    private changeName(user: SosUser) {
        if(user != null) {
            // Update the name of the user in the right Menu
            if (user.profilePicture != "") {
                if (user.profilePicture != null) {
                    this.rightMenu[0].img = user.profilePicture;
                }
            } else {
                this.rightMenu[0].img = "./assets/images/profilePictures/anonym.jpg";
            }
            this.rightMenu[0].name = user.firstname;
        }
    }
}
