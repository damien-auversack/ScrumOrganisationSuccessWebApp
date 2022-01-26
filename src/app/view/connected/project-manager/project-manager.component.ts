import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../services";
import {ProjectsService} from "../../../services/projects/projects.service";
import {UsersProjectsService} from "../../../services/users-projects/users-projects.service";
import {Project} from "../../../domain/project";
import {Subscription} from "rxjs";
import {Role} from "../../../domain/role";

@Component({
    selector: 'app-project-manager',
    templateUrl: './project-manager.component.html',
    styleUrls: ['../../../app.component.css', './project-manager.component.css']
})
export class ProjectManagerComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    private STATUS_INACTIVE: number = 1;
    private STATUS_ACTIVE: number = 2;
    private STATUS_TERMINATE: number = 3;

    isProjectAlreadyExist: boolean = false;
    isProductOwner: boolean = false;
    buttonPressed: boolean = false;

    username: string = "";
    idUser: number = 0;

    activeProject: Project[] = [];
    oldProjects: Project[] = [];

    subtitles: string[] = [
        "Active project",
        "Old projects"
    ];

    constructor(private authenticationService: AuthenticationService,
                private developerProjectService: UsersProjectsService,
                private projectService: ProjectsService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.authenticationService.currentUser.subscribe(user => {
            if(user != null) {
                this.username = user.firstname;
                if(user.id != undefined) {
                    this.idUser = user.id;
                }
                this.isProductOwner = user.role == Role.ProductOwner;
            }
        });
        this.loadProjects();
    }

    // Get developer projects then call getProjectName
    private loadProjects() {
        this.activeProject = [];
        this.oldProjects = [];

        this.subscription = this.developerProjectService.getByIdDeveloper(this.idUser).subscribe(developerProjects => {
            for (let i = 0 ; i < developerProjects.length ; i++) {
                if(!developerProjects[i].isAppliance) {
                    this.getProjectName(developerProjects[i].idProject);
                }

            }
        });
    }

    // Get project then push to active or old projects
    private getProjectName(idProject: number) {
        this.subscription = this.projectService.getById(idProject).subscribe(project => {
            if(project.status == this.STATUS_ACTIVE || (project.status == this.STATUS_INACTIVE && this.isProductOwner)) {
                this.activeProject.push(project);
            } else if(project.status == this.STATUS_TERMINATE) {
                this.oldProjects.push(project);
            }
        });
    }

    // Terminate the active project then reload project
    terminate(project:Project) {
        project.status = this.STATUS_TERMINATE;
        this.subscription = this.projectService.updateStatus(project).subscribe(() => {
            this.loadProjects();
        });
    }

    toggleButtonPress(isPressed:boolean) {
        this.buttonPressed = isPressed;
    }
}
