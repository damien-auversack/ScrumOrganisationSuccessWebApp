import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {DatePipe} from "@angular/common";
import {ProjectsService} from "../../../services/projects/projects.service";
import {Project} from "../../../domain/project";
import {UserProject} from "../../../domain/user-project";
import {SosUser} from "../../../domain/sos-user";
import {UsersProjectsService} from "../../../services/users-projects/users-projects.service";
import {Subscription} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-create-project',
    templateUrl: './create-project.component.html',
    styleUrls: ['../../../app.component.css', './create-project.component.css']
})
export class CreateProjectComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    buttonIsPressed: boolean = false;
    isDateOk: boolean = true;
    title: string = "Create project";
    currentUser: SosUser = null!;
    userId: number = 0;

    form:FormGroup = this.fb.group({
        main: this.fb.group({
            nameProject:this.fb.control('', Validators.required),
            deadline:this.fb.control('', Validators.required),
            description:this.fb.control('', Validators.required),
            repositoryURL:this.fb.control('', Validators.required)
        })
    });
    isBackButtonPressed: boolean = false;
    projectAlreadyExists: boolean = false;
    isAddOk: boolean = false;

    constructor(private fb: FormBuilder,
                private projectService : ProjectsService,
                private developersProjectsService : UsersProjectsService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.currentUser = <SosUser>JSON.parse(<string>localStorage.getItem('currentUser'));
        this.userId = (this.currentUser.id==undefined)?0:this.currentUser.id;
    }

    sendData() {
        this.isDateOk = true;
        this.projectAlreadyExists = false;
        this.isAddOk = false;

        // Set project values
        let projet: Project = {
            name: this.form.getRawValue().main.nameProject,
            deadline: this.form.getRawValue().main.deadline,
            description: this.form.getRawValue().main.description,
            repositoryUrl: this.form.getRawValue().main.repositoryURL,
            status: 1
        }

        // Add project in the database, if the date is in the future
        if(new Date() < new Date(this.form.getRawValue().main.deadline)){
            // Add project
            this.subscription = this.projectService.addProject(projet)
                .pipe(
                    map(project => {
                        // Assign the product owner to the project
                        let devProject:UserProject = {
                            idDeveloper : this.userId,
                            idProject : project.id!,
                            isAppliance : false
                        }
                        this.developersProjectsService.addDeveloperProject(devProject).subscribe();
                        this.isAddOk = true;
                    })
                ).subscribe(() => {}, // Ignore success result
                    error => {
                        this.projectAlreadyExists = true;
                    });
        }
        else{
            this.isDateOk = false;
        }
    }

    autoComplete() {
        let datePipe = new DatePipe('en-GB');
        let date = datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.form.setValue({
            main: {
                nameProject: "Your project name.",
                deadline: date,
                description: "Your project description.",
                repositoryURL: "URL repository."
            }
        });
    }

    toggleBackButtonPress(isPressed: boolean) {
        this.isBackButtonPressed = isPressed;
    }
    toggleButtonPress(isPressed:boolean) {
        this.buttonIsPressed = isPressed;
    }
}
