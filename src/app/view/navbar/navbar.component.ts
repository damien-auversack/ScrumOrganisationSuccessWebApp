import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services";
import {Role} from "../../domain/role";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['../../app.component.css', './navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    RoleEnum = Role;
    role:Role = Role.Visitor;

    constructor(private authenticationService: AuthenticationService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.subscription = this.authenticationService.currentUser.subscribe(()=>this.changeRole());
    }

    // Assign the role of the user to the component
    private changeRole() {
        let currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
        if(currentUser != null) {
            this.role = currentUser.role;
        } else {
            this.role = Role.Visitor;
        }
    }

}
