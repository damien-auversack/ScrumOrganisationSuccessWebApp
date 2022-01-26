import {Component, OnDestroy, OnInit} from '@angular/core';
import { Project} from "../../../domain/project";
import { AuthenticationService } from "../../../services";
import { UsersProjectsService } from "../../../services/users-projects/users-projects.service";
import { ProjectsService } from "../../../services/projects/projects.service";
import { SosUser } from "../../../domain/sos-user";
import { UserProject } from "../../../domain/user-project";
import {Subscription} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-join-project',
    templateUrl: './join-project.component.html',
    styleUrls: ['../../../app.component.css', './join-project.component.css']
})
export class JoinProjectComponent implements OnInit, OnDestroy {
    projects: Project[] = [];

    nonAppliedProjects:Project[] =[];
    appliedProjects:Project[] =[];

    projectsName: string[] = [];
    projectsIsApply: boolean[] = [];

    assigned: boolean = false;
    IsNonAppliedEmpty : boolean = false;
    currentUser: SosUser = null!;
    userId: number = 0;

    private subscription: Subscription | undefined;

    constructor(private authenticationService: AuthenticationService,
                private projectService: ProjectsService,
                private developersProjectsService : UsersProjectsService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.currentUser = <SosUser>JSON.parse(<string>localStorage.getItem('currentUser'));
        this.userId = (this.currentUser.id == undefined) ? 0 : this.currentUser.id;

        this.subscription = this.loadAllProjects().pipe(map(()=>{
            this.isAssigned();
        })).subscribe();
    }

    // Get all projects
    private loadAllProjects(){
        return this.projectService.getActiveProject().pipe(map(projects=>{
            this.projects = projects
            this.loadLinkedProjects().subscribe();
        }));
    }

    // Get all LinkedProjects
    private loadLinkedProjects(){
        return this.projectService.getByIdUserNotFinishedIsLinked(this.userId).pipe(map(projects=>{
            this.appliedProjects = projects;

            // Subtract the two lists from each other
            // Remove linked elements from array with all elements
            this.nonAppliedProjects=[];
            for(let projet of this.projects){
                let tmpBool = true
                for(let projetApplied of this.appliedProjects){
                    if(projet.id==projetApplied.id){
                        tmpBool = false
                    }
                }
                if(tmpBool)this.nonAppliedProjects.push(projet);
            }
            this.IsNonAppliedEmpty = this.nonAppliedProjects.length == 0;
        }));
    }

    joinProject(project: Project) {
        // Create developerProject
        let devProject:UserProject = {
            idDeveloper : this.userId,
            idProject : project.id!,
            isAppliance : true
        }
        // Send request
        this.subscription = this.developersProjectsService.addDeveloperProject(devProject)
            .pipe(
                map(result => {
                    if(result != null) {
                        // Modify the value of the appliance to avoid making several requests for the same project
                        this.subscription = this.loadAllProjects().pipe(map(()=>{
                            this.isAssigned();
                        })).subscribe();
                        // Update status inactive
                        project.status = 1;
                        this.projectService.updateStatus(project).subscribe();
                    }
                })
        ).subscribe();
    }

    // Allows you to know if a user has already applied for a project
    private isAssigned() {
        this.developersProjectsService.getByIdDeveloperIsAppliance(this.userId).subscribe(tmp => {
            this.assigned = tmp.length != 0;
        });
    }

    // Allows to know if the project has already had an appliance of this user
    isAppliance(project: Project) {
        this.developersProjectsService.getByIdDeveloperIdProject(this.userId, project.id!).subscribe(developerProject => {
            this.projectsIsApply.push(developerProject != null);
        });
    }
}
