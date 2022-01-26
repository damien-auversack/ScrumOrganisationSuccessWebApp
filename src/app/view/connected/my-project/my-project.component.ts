import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../../services";
import { ProjectsService } from "../../../services/projects/projects.service";
import { DatePipe } from "@angular/common";
import { SprintsService } from "../../../services/sprints/sprints.service";
import { Sprint } from "../../../domain/sprint";
import { UserStoriesService } from "../../../services/user-stories/user-stories.service";
import { SprintsUserStoriesService } from "../../../services/sprints-user-stories/sprints-user-stories.service";
import { Role } from "../../../domain/role";
import { SosUser } from "../../../domain/sos-user";
import { Subscription } from "rxjs";

export interface ZippedSprint {
    id: number | undefined;
    name: string;
    US: string[];
}

@Component({
    selector: 'app-my-project',
    templateUrl: './my-project.component.html',
    styleUrls: ['../../../app.component.css', './my-project.component.css']
})
export class MyProjectComponent implements OnInit, OnDestroy {
    private NO_PROJECT: string = "No projects found.";
    private DATE_FORMAT: string = 'dd/MM/yyyy';

    private projectSubscription: Subscription | undefined;
    private sprintSubscription: Subscription | undefined;
    private sprintUserStorySubscription: Subscription | undefined;
    private userStorySubscription: Subscription | undefined;

    isProductBacklogButtonPressed: boolean = false;
    isBackButtonPressed: boolean = false;
    isDeleteButtonPressed: boolean = false;
    isCreateSprintButtonPressed: boolean = false;

    isScrumMaster: boolean = false;
    isProductOwner: boolean = false;
    clicked: any;
    idProject: number = 0;

    projectName: string | null = "";
    deadline: string | null = "";
    description: string = "";
    repositoryUrl: string = "";
    datePipe = new DatePipe('en-GB');

    oldSprints: ZippedSprint[] = [];
    actualSprint: ZippedSprint = {
        id: 0,
        name: "",
        US: []
    };

    constructor(private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private projectService: ProjectsService,
                private sprintService: SprintsService,
                private sprintUserStoryService: SprintsUserStoriesService,
                private userStoryService: UserStoriesService,
                private router: Router) { }

    ngOnDestroy(): void {
        this.projectSubscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.projectName = this.route.snapshot.paramMap.get("projectName");
        if(this.projectName == this.NO_PROJECT) {
            this.router.navigate(["/**"]);
        }
        else {
            let user: SosUser = JSON.parse(<string>localStorage.getItem('currentUser'));
            this.isScrumMaster = user.role == Role.ScrumMaster;
            this.isProductOwner = user.role == Role.ProductOwner;
            this.loadProjectInfo();
        }
    }

    private loadProjectInfo() {
        this.getProject();
    }

    // Set project values
    private getProject() {
        this.projectSubscription = this.projectService.getByProjectName(this.projectName).subscribe(project => {
            this.deadline = this.datePipe.transform(project.deadline, this.DATE_FORMAT);
            this.description = project.description;
            this.repositoryUrl = project.repositoryUrl;
            this.idProject = project.id!;
            this.getSprints(this.idProject);
        });
    }

    private getSprints(idProject: number) {
        this.sprintSubscription = this.sprintService.getByIdProject(idProject).subscribe(sprints => {
            for(let i = 0 ; i < sprints.length ; i++) {
                let sprint: Sprint = sprints[i];
                // Save the dates as dates elements:
                // Angular date object and sql server date object are not the same
                // so this "cast" is necessary
                // then getting the value of the date to compare dates
                let todayAsTime: number = new Date().getTime();
                let startAsTime: number = new Date(sprint.startDate).getTime();
                let deadlineAsTime: number = new Date(sprint.deadline).getTime();

                // A sprint is active if today's date is between the start and end of the sprint
                if(startAsTime <= todayAsTime && todayAsTime <= deadlineAsTime) {
                    this.actualSprint = {id: sprint.id, name: sprint.description, US: []};
                } else {
                    this.oldSprints.push({id: sprint.id, name: sprint.description, US: []});
                }

                // Get the links to user stories about this
                if (sprint.id != null) {
                    this.getLinksSprintsUserStories(sprint.id);
                }
            }
        });
    }

    // Get User Story ID
    private getLinksSprintsUserStories(idSprint: number): void {
        this.sprintUserStorySubscription = this.sprintUserStoryService.getByIdSprint(idSprint).subscribe(sprintsUserStories => {
            for (let i = 0 ; i < sprintsUserStories.length ; i++) {
                let idUserStory: number = <number>sprintsUserStories[i].idUserStory;
                this.getUserStory(idUserStory, idSprint);
            }
        });
    }

    private getUserStory(idUserStory: number, idSprint: number) {
        this.userStorySubscription = this.userStoryService.getById(idUserStory).subscribe(userStory => {
            // Only one sprint so no need to do a for
            if(this.actualSprint.id == idSprint) {
                this.actualSprint.US.push("US" + userStory.priority + " : " + userStory.description);
                return; // No need to look in the old sprints if it is the actual one
            }
            for (let i = 0 ; i < this.oldSprints.length ; i++) {
                if(this.oldSprints[i].id == idSprint) {
                    this.oldSprints[i].US.push("US" + userStory.priority + " : " + userStory.description);
                }
            }
        });
    }

    toggleProductBacklogButtonPress(isPressed: boolean) {
        this.isProductBacklogButtonPressed = isPressed;
    }
    toggleBackButtonPress(isPressed: boolean) {
        this.isBackButtonPressed = isPressed;
    }
    toggleCreateSprintButtonPress(isPressed: boolean) {
        this.isCreateSprintButtonPressed = isPressed;
    }
    toggleDeleteButtonPress(isPressed: boolean){
        this.isDeleteButtonPressed = isPressed;
    }

}

