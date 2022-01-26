import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserStory } from "../../../domain/user-story";
import {ActivatedRoute} from "@angular/router";
import { ProjectsService } from "../../../services/projects/projects.service";
import { UserStoriesService } from "../../../services/user-stories/user-stories.service";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Sprint } from "../../../domain/sprint";
import { SprintsService } from "../../../services/sprints/sprints.service";
import {SprintsUserStoriesService} from "../../../services/sprints-user-stories/sprints-user-stories.service";
import {SprintUserStory} from "../../../domain/sprint-user-story";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-create-sprint',
    templateUrl: './create-sprint.component.html',
    styleUrls: ['../../../app.component.css', './create-sprint.component.css']
})
export class CreateSprintComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;
    private idProject: number = 0;

    title: string = "Create sprint";
    selectedUserStory: UserStory | undefined;
    chosenUserStories: UserStory[] = [];
    isButtonPressed: boolean = false;
    projectName: string | null = "";
    dateIsInPast : boolean = false;

    form:FormGroup = this.fb.group({
        main: this.fb.group({
            deadline:this.fb.control('', Validators.required),
            description:this.fb.control('', Validators.required)
        })
    });

    productBacklog: UserStory[] = [];
    isBackButtonPressed: boolean = false;
    sprintAlreadyExists: boolean = false;
    isAddOk: boolean = false;

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private projectService: ProjectsService,
                private userStoryService: UserStoriesService,
                private sprintService: SprintsService,
                private sprintUserStoryService: SprintsUserStoriesService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.projectName = this.route.snapshot.paramMap.get("projectName");
        this.loadProductBacklog();
    }

    // Add User story selected to the chosen user story vector
    addToChosenUserStories() {
        if (this.selectedUserStory != null && !this.chosenUserStories.includes(this.selectedUserStory)) {
            this.chosenUserStories.push(this.selectedUserStory);
        }
    }

    // Assign selected user story from view in model
    assignToSelected(selected: string) {
        for (let userStory of this.productBacklog) {
            if(userStory.name == selected) {
                this.selectedUserStory = userStory
            }
        }
    }

    sendData() {
        this.dateIsInPast = false;
        let rawValues = this.form.getRawValue().main;
        // Date verification, if the date is in the future
        if(new Date(rawValues.deadline)>new Date()){
            // Get the number of sprints
            this.subscription = this.sprintService.getMaxNumberOfSprints(this.idProject)
                .pipe(
                    map(result => {
                        let sprint: Sprint = {
                            idProject: this.idProject,
                            sprintNumber: result + 1, // Result is the max number of sprints already present in the database
                            startDate: new Date(),
                            description: rawValues.description,
                            deadline: new Date(rawValues.deadline)
                        };
                        this.addSprint(sprint);
                    })).subscribe();
        }
        else {
            this.dateIsInPast = true; // Date is in the past
        }
    }

    private loadProductBacklog() {
        this.subscription = this.getProject().subscribe();
    }

    // Get the id of the active project
    private getProject() {
        return this.projectService.getByProjectName(this.projectName).pipe(
            map(project => {
                if (project.id != null) {
                    this.idProject = project.id;
                    this.getUserStories(project.id);
                }
            }
        ));
    }

    // Get the user stories that match the project id
    private getUserStories(id: number) {
        this.userStoryService.getByIdProject(id).subscribe(userStories => {
            for (let i = 0 ; i < userStories.length ; i++) {
                let userStory: UserStory = userStories[i];
                this.productBacklog.push(userStory);
            }
        });
    }

    // Add a sprint to the active sprint
    private addSprint(sprint: Sprint) {
        this.isAddOk = false;
        this.sprintAlreadyExists = false;

        this.subscription = this.sprintService.addSprint(sprint).pipe(
            map(sprintResult => {
                for (let userStory of this.chosenUserStories) {
                    let sprintUserStory: SprintUserStory = {
                        idSprint: sprintResult.id,
                        idUserStory: userStory.id
                    };
                    this.sprintUserStoryService.addSprintUserStory(sprintUserStory).subscribe();
                }
                this.isAddOk = true;
            })
        ).subscribe(() => {},
            error => {
                this.sprintAlreadyExists = true;
            }
        );
    }

    autoComplete() {
        let datePipe = new DatePipe('en-GB');
        let date = datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.form.setValue({
            main: {
                deadline : date,
                description:"Description du sprint"
            }
        });
    }

    toggleBackButtonPress(isPressed: boolean) {
        this.isBackButtonPressed = isPressed;
    }
    toggleButtonPress(isPressed:boolean) {
        this.isButtonPressed = isPressed;
    }
}
