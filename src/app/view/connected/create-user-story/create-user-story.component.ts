import { Component, OnDestroy, OnInit } from '@angular/core';
import { SosUser } from "../../../domain/sos-user";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProjectsService } from "../../../services/projects/projects.service";
import { UsersProjectsService } from "../../../services/users-projects/users-projects.service";
import { ActivatedRoute } from "@angular/router";
import { UserStory } from "../../../domain/user-story";
import { UserStoriesService } from "../../../services/user-stories/user-stories.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-create-user-story',
  templateUrl: './create-user-story.component.html',
  styleUrls: ['../../../app.component.css', './create-user-story.component.css']
})
export class CreateUserStoryComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    buttonIsPressed: boolean = false;
    title: string = "Create User Story";
    projectName: string | null = "";
    idProject: number = 0;

    currentUser: SosUser = null!;
    userId: number = 0;

    form:FormGroup = this.fb.group({
        main: this.fb.group({
            name:this.fb.control('', Validators.required),
            description:this.fb.control('', Validators.required),
            priority:this.fb.control('', Validators.required)
        })
    });
    isBackButtonPressed: boolean = false;
    isPriorityNaN: boolean = false;
    isAddOk: boolean = false;
    userStoryAlreadyExists: boolean = false;

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
        this.currentUser = <SosUser>JSON.parse(<string>localStorage.getItem('currentUser'));
        this.userId = (this.currentUser.id==undefined)?0:this.currentUser.id;
    }

    // Add UserStory in the database
    sendData() {
        this.isAddOk = false;
        this.isPriorityNaN = false;
        this.userStoryAlreadyExists = false;

        // Create project
        let tmpUserStory: UserStory = {
            idProject: <number>this.idProject,
            name: this.form.getRawValue().main.name,
            description: this.form.getRawValue().main.description,
            priority: Number(this.form.getRawValue().main.priority)
        }

        if(!isNaN(Number(this.form.getRawValue().main.priority))) {
            // Add UserStory in the database
            this.subscription = this.userStoriesService.addUserStory(tmpUserStory)
                .subscribe(() => {
                        this.isAddOk = true;
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
                name: "Your userStory name.",
                description: "Your userStory description.",
                priority: 1
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
