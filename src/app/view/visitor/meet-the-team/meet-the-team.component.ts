import {Component, OnDestroy, OnInit} from '@angular/core';
import {SosUser} from "../../../domain/sos-user";
import {UserService} from "../../../services";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-meet-the-team',
    templateUrl: './meet-the-team.component.html',
    styleUrls: ['../../../app.component.css', './meet-the-team.component.css']
})
export class MeetTheTeamComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    title: string = "Meet the team";
    team: SosUser[] = [
        {
            firstname: "",
            lastname: "",
            password: "",
            email: "",
            profilePicture: undefined,
            birthdate: new Date(),
            role: 0
        },
        {
            firstname: "",
            lastname: "",
            password: "",
            email: "",
            profilePicture: undefined,
            birthdate: new Date(),
            role: 0
        },
        {
            firstname: "",
            lastname: "",
            password: "",
            email: "",
            profilePicture: undefined,
            birthdate: new Date(),
            role: 0
        },
        {
            firstname: "",
            lastname: "",
            password: "",
            email: "",
            profilePicture: undefined,
            birthdate: new Date(),
            role: 0
        }
    ];

    constructor(private userService: UserService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.initTeam();
    }

    // Fill team page
    private initTeam(): void {
        let mails: string[] = ["damsover@gmail.com", "martin.maes100.000@gmail.com", "floran.houdart@gmail.com",
            "florian.mazzeo@gmail.com"];

        for(let i = 0 ; i < mails.length ; i++) {
            this.subscription = this.userService.getByEmail(mails[i]).subscribe(user => {
                this.team[i].firstname = user.firstname;
                this.team[i].lastname = user.lastname;
                this.team[i].email = user.email;
                this.team[i].profilePicture = user.profilePicture;
            });
        }
    }
}
