import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserStory} from "../../../domain/user-story";
import {UserStoriesService} from "../../../services/user-stories/user-stories.service";
import {SprintsUserStoriesService} from "../../../services/sprints-user-stories/sprints-user-stories.service";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {SosUser} from "../../../domain/sos-user";
import {Role} from "../../../domain/role";
import {SprintsService} from "../../../services/sprints/sprints.service";
import {ProjectsService} from "../../../services/projects/projects.service";

@Component({
  selector: 'app-sprint-user-story',
  templateUrl: './sprint-user-story.component.html',
  styleUrls: ['../../../app.component.css', './sprint-user-story.component.css']
})
export class SprintUserStoryComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;
    UserStories: UserStory[] = [];

    projectName: string | null = "";
    idProject: number = 0;
    idSprint: number = 0;
    sprintName: string | null = "";

    isCreateMeetingButtonPressed: boolean = false;
    isBackButtonPressed: boolean = false;
    isScrumMaster: boolean = false;

    constructor(private userStoriesService:UserStoriesService,
              private sprintsUserStoriesService:SprintsUserStoriesService,
              private sprintService: SprintsService,
              private projectService: ProjectsService,
              private activatedRoute: ActivatedRoute) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.idProject = <number><unknown>this.activatedRoute.snapshot.paramMap.get("idProject");
        this.idSprint = Number(this.activatedRoute.snapshot.paramMap.get("idSprint"));
        this.sprintName = this.activatedRoute.snapshot.paramMap.get("sprintName");

        // Get information about the Sprint and the project (description, name)
        this.subscription = this.sprintService.getById(this.idSprint).pipe(
            map(result => {
                this.sprintName = result.description;
                this.projectService.getById(result.idProject).subscribe(project => {
                    this.projectName = project.name;
                });
            })
        ).subscribe();

        let user: SosUser = JSON.parse(<string>localStorage.getItem('currentUser'));
        this.isScrumMaster = user.role == Role.ScrumMaster;

        this.fillUserStories();
    }

    // Get User Stories that match the previously retrieved id list
    private fillUserStories() {
        this.subscription = this.userStoriesService.getByIdSprint(this.idSprint)
            .pipe(
                map(UserStoriesTmp => {
                    this.UserStories = UserStoriesTmp;
                })
            ).subscribe()
    }

    toggleCreateMeetingButtonPress(isPressed: boolean) {
        this.isCreateMeetingButtonPressed = isPressed;
    }
    toggleBackButtonPress(isPressed: boolean) {
        this.isBackButtonPressed = isPressed;
    }
}
