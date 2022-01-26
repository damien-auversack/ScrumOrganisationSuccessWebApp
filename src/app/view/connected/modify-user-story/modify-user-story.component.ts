import {Component, OnDestroy, OnInit} from '@angular/core';
import { SosUser } from "../../../domain/sos-user";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ProjectsService } from "../../../services/projects/projects.service";
import { UsersProjectsService } from "../../../services/users-projects/users-projects.service";
import { UserStoriesService } from "../../../services/user-stories/user-stories.service";
import { UserStory } from "../../../domain/user-story";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-modify-user-story',
  templateUrl: './modify-user-story.component.html',
  styleUrls: ['../../../app.component.css', './modify-user-story.component.css']
})
export class ModifyUserStoryComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    buttonIsPressed: boolean = false;
    title: string = "Modify User Story";
    projectName: string | null = "";

    idProject: number = 0;
    idUserStory: number = 0;
    currentUser: SosUser = null!;

    isPriorityNaN: boolean = false;
    isUpdateOk: boolean = false;
    userStoryAlreadyExists: boolean = false;

    isBackButtonPressed: boolean = false;
    userId: number = 0;
    form:FormGroup = this.fb.group({
        main: this.fb.group({
            name:this.fb.control('', Validators.required),
            description:this.fb.control('', Validators.required),
            priority:this.fb.control('', Validators.required)
        })
    });

    constructor(private route: ActivatedRoute,
                private fb: FormBuilder,
                private projectService : ProjectsService,
                private developersProjectsService : UsersProjectsService,
                private userStoriesService:UserStoriesService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.projectName = this.route.snapshot.paramMap.get("projectName");
        this.idProject = Number(this.route.snapshot.paramMap.get("idProject"));
        this.idUserStory = Number(this.route.snapshot.paramMap.get("idUserStory"));

        this.fillFormWithCurrentUSValues();

        this.currentUser = <SosUser>JSON.parse(<string>localStorage.getItem('currentUser'));
        this.userId = (this.currentUser.id == undefined) ? 0 : this.currentUser.id;
    }

    sendData() {
        this.isUpdateOk = false;
        this.isPriorityNaN = false;
        this.userStoryAlreadyExists = false;

        // Set UserStory values
        let tmpUserStory: UserStory = {
            idProject: <number>this.idProject,
            name: this.form.getRawValue().main.name,
            description: this.form.getRawValue().main.description,
            priority: Number(this.form.getRawValue().main.priority)
        }

        if(!isNaN(Number(this.form.getRawValue().main.priority))) {
            // Add UserStory in the database
            this.subscription = this.userStoriesService.updateUserStory(tmpUserStory,this.idUserStory)
                .subscribe(() => {
                        this.isUpdateOk = true;
                    },
                    error => {
                        this.userStoryAlreadyExists = true;
                    });
        } else {
            this.isPriorityNaN = true;
        }
    }

    autoComplete() {
        this.form.setValue({
            main: {
                name: "Your user story name.",
                description: "Your user story description.",
                priority: 1
            }
        });
    }

    // Set the form values from the values of the current user story
    private fillFormWithCurrentUSValues() {
        this.subscription = this.userStoriesService.getById(this.idUserStory).subscribe(userStory => {
            this.form.controls['main'].setValue({
                name: userStory.name,
                description: userStory.description,
                priority: userStory.priority
            });
        });
    }

    toggleBackButtonPress(isPressed: boolean) {
        this.isBackButtonPressed = isPressed;
    }
    toggleButtonPress(isPressed:boolean) {
        this.buttonIsPressed = isPressed;
    }
}
