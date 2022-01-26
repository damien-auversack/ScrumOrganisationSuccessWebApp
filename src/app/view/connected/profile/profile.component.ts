import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService, UserService } from "../../../services";
import { SosUser } from "../../../domain/sos-user";
import { Technology } from "../../../domain/technology";
import { TechnologiesService } from "../../../services/technologies/technologies.service";
import { UsersTechnologiesService } from "../../../services/users-technologies/users-technologies.service";
import { UserTechnology } from "../../../domain/user-technology";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['../../../app.component.css', './profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    private _lastName = '';
    private _firstName = '';
    email = '';
    idUser: number = 0;
    profilePicture: string | undefined = "./assets/images/profilePictures/anonym.jpg";

    technologies: Technology[] = [];
    isEditButtonHidden: boolean = true;
    buttonIsPressed: boolean = false;

    idTechnologies:number[] = [];
    isHisTechnologies:boolean[] = [];

    form:FormGroup = this.fb.group({
        main: this.fb.group({
            lastName: this.fb.control(this._lastName, Validators.required),
            firstName: this.fb.control(this._firstName, Validators.required)
        })
    });
    private otherSubscription: Subscription |undefined;
    experience: number = 0;

    constructor(private fb: FormBuilder,
                private authenticationService: AuthenticationService,
                private technologyService: TechnologiesService,
                private userTechnology: UsersTechnologiesService,
                private userService: UserService,
                private route: Router) { }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
        this.otherSubscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.fillProfile(JSON.parse(<string>localStorage.getItem('currentUser')));
        this.subscription = this.loadAvailableTechnologies().pipe(
            map(() => {
                this.fillIsHisTechnologies().pipe(
                    map(() => {
                        this.userService.daysOfXp(this.idUser).subscribe(xp => this.experience = xp);
                    })
                ).subscribe();
            })
        ).subscribe();
    }

    // Fill User profile values
    fillProfile(user: SosUser) {
        this._lastName = user.lastname;
        this._firstName = user.firstname;
        this.email = user.email;

        if (user.id != null) {
            this.idUser = user.id;
        }
        this.profilePicture = user.profilePicture;
        this.form.controls['main'].setValue({
            lastName: user.lastname,
            firstName: user.firstname
        });
    }

    // Fill technologies array and idTechnologies array
    private loadAvailableTechnologies() {
        return this.technologyService.getAll().pipe(
            map(technologies => {
                for (let i = 0 ; i < technologies.length ; i++) {
                    this.technologies.push(technologies[i]);
                    this.idTechnologies.push(technologies[i].id);
                }
            })
        );
    }

    // Fill IsHisTechnologies array
    fillIsHisTechnologies() {
        return this.userTechnology.getByUserId(this.idUser).pipe(
            map(userTechnologies => {
                for (let userTechnology of userTechnologies) {
                    let id: number = userTechnology.idTechnology;
                    let result: boolean = this.idTechnologies.includes(id);
                    let index: number = this.idTechnologies.indexOf(id);
                    this.isHisTechnologies[index] = result;
                }
            })
        );
    }

    // Delete user technology from the database
    deleteTechnology(idTechnology: number) {
        this.otherSubscription = this.userTechnology.deleteUserTechnology(this.idUser, idTechnology).subscribe();
    }

    // Add user technology in the database
    addTechnology(idTechnology: number) {
        let tmpUserTechnology: UserTechnology = {
            idUser: this.idUser,
            idTechnology: idTechnology
        };
        this.otherSubscription = this.userTechnology.addUserTechnology(tmpUserTechnology).subscribe();
    }

    // Toggle if it's his technology or not
    modifyTechnologies(event : any, elt:Technology){
        let index = this.technologies.indexOf(elt);
        this.isHisTechnologies[index] = !!event.target.checked;
    }

    sendData() {
        let tmpUser:SosUser = {
            id: this.idUser,
            firstname: this.form.getRawValue().main.firstName,
            lastname: this.form.getRawValue().main.lastName,
            email: "",
            profilePicture: "",
            birthdate: new Date(),
            password: "",
            description: "",
            role: 0,
            token: "",
            portfolio: ""
        };

        // Fill in an array to see the current state of techno,
        // then compare with what we have to see those we must modify
        this.userTechnology.getByUserId(this.idUser).pipe(
            map(userTechnologies => {
                let dbTechnologies = [];
                for (let userTechnology of userTechnologies) {
                    let id: number = userTechnology.idTechnology;
                    let result: boolean = this.idTechnologies.includes(id);
                    let index: number = this.idTechnologies.indexOf(id);
                    dbTechnologies[index] = result;
                }

                // Then compare with what we have to see which ones we must modify
                for(let i = 0; i<this.technologies.length; i++){
                    if(dbTechnologies[i] != this.isHisTechnologies[i]){

                        // Check whether to add or remove it
                        if(this.isHisTechnologies[i]){
                            this.addTechnology(this.technologies[i].id);
                        }
                        else{
                            this.deleteTechnology(this.technologies[i].id);
                        }
                    }
                }
            })
        ).subscribe();

        // Update the first and last name then disconnect the user
        this.otherSubscription = this.userService.updateFirstNameLastName(tmpUser).subscribe(() => {
            this.authenticationService.logout();
            this.route.navigate(['/login']);
        });
    }
    toggleButtonPress(isPressed: boolean) {
        this.buttonIsPressed = isPressed;
    }
}
