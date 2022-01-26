import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserStoriesService} from "../../../services/user-stories/user-stories.service";
import {ActivatedRoute} from "@angular/router";
import {ProjectsService} from "../../../services/projects/projects.service";
import {UserStory} from "../../../domain/user-story";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {Role} from "../../../domain/role";
import {SosUser} from "../../../domain/sos-user";

@Component({
    selector: 'app-product-backlog',
    templateUrl: './product-backlog.component.html',
    styleUrls: ['../../../app.component.css', './product-backlog.component.css']
})
export class ProductBacklogComponent implements OnInit, OnDestroy {
    projectName: string | null = "";
    isButtonPressed: boolean = false;
    idProject: number = 0;

    productBacklog:UserStory[] =[];
    private subscription: Subscription | undefined;

    isProductOwner: boolean = false;
    currentUser:SosUser=null!;

    constructor(private route: ActivatedRoute,
                private userStoriesService:UserStoriesService,
                private userStoryService: UserStoriesService,
                private projectService: ProjectsService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.isProductOwner = JSON.parse(<string>localStorage.getItem('currentUser')).role == Role.ProductOwner;
        this.idProject = <number><unknown>this.route.snapshot.paramMap.get("idProject");
        this.projectName = this.route.snapshot.paramMap.get("projectName");
        this.loadProductBacklog();
    }

    private loadProductBacklog() {
        this.subscription = this.getProject().subscribe();
    }

    // Get the project id and call getUserStories
    private getProject() {
        return this.projectService.getByProjectName(this.projectName).pipe(
            map(project => {
                if (project.id != null) {
                    this.getUserStories(project.id);
                }
            }
        ));
    }

    // Get user stories and add them to the product backlog
    private getUserStories(id: number) {
        this.userStoryService.getByIdProject(id).subscribe(userStories => {
            for(let i = 0 ; i < userStories.length ; i++) {
                this.productBacklog.push(userStories[i]);
            }
        });
    }

    // Delete user story from the database
    deleteUserStory(userStory:UserStory) {
        this.subscription = this.userStoriesService.deleteUserStory(userStory).subscribe(() => {
            this.productBacklog = this.productBacklog.filter((tmp)=> {
                return userStory.id != tmp.id;
            });
        });
    }

    toggleButtonPress(isPressed: boolean) {
        this.isButtonPressed = isPressed;
    }
}
