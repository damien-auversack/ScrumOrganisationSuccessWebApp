import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SosUser} from "../../../domain/sos-user";
import {UsersProjectsService} from "../../../services/users-projects/users-projects.service";
import {Project} from "../../../domain/project";
import {ProjectsService} from "../../../services/projects/projects.service";
import {UserService} from "../../../services";
import {UserProject} from "../../../domain/user-project";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {Role} from "../../../domain/role";

@Component({
  selector: 'app-users-request',
  templateUrl: './users-request.component.html',
  styleUrls: ['../../../app.component.css', './users-request.component.css']
})

export class UsersRequestComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    private STATUS_ACTIVE: number = 2;
    nameProject: string | null = "";
    buttonIsPressed: boolean = false;

    clicked: any;
    idProjectActive: number | undefined;
    currentUser:SosUser = null!;

    appliedDevelopers:SosUser[] = []
    appliedScrumMasters:SosUser[] = []

    isScrumMasterEmpty:boolean = true;
    acceptTxt:string = "Accept";

    constructor(private route: ActivatedRoute,
                private usersProjectsService: UsersProjectsService,
                private projectService: ProjectsService,
                private userService: UserService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.isScrumMasterEmpty = true;
        this.nameProject = this.route.snapshot.paramMap.get("nameProject");
        this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
        this.fillUsers();
    }

    private fillUsers() {
        this.subscription = this.getCurrentProject().subscribe();
    }

    // Get the active project the product owner is currently working on
    private getCurrentProject() {
        return this.projectService.getByIdUserActiveProject(this.currentUser.id!)
            .pipe(
                map(
                (userProjects)=>{
                    // Return an array to avoid bugs if someone has multiple projects (this shouldn't happen)
                    if(userProjects!=null && userProjects.length!=0){
                        this.idProjectActive =userProjects[0].id;
                        this.getApplyingUsers(userProjects[0].id!);
                    }
                }
        ));
    }

    // Get all the user that are applying
    private getApplyingUsers(idProject : number){
        this.userService.getByIdProjectIsApplying(idProject).pipe(
            map(
                (users)=>{
                    // Separate the scrum masters from the dev
                    for(let user of users){
                        if(user.role==Role.Developer){
                            this.appliedDevelopers.push(user);
                        }
                        else if(user.role==Role.ScrumMaster){
                            this.appliedScrumMasters.push(user);
                        }
                    }

                    // Check if there is already a scrum master in the list of user working on it
                    this.isAlreadyScrumMaster(idProject).subscribe();
                }
           )
        ).subscribe();
    }

    // Check if there is already a scrum master in the list of user working on it
    private isAlreadyScrumMaster(idProject : number){
        return this.userService.getByIdProjectIsWorking(idProject).pipe(map(users => {
            for(let user of users){
                if (user.role==Role.ScrumMaster){
                    this.isScrumMasterEmpty = false;
                }
            }
        }))
    }

    // Accept a user
    accept(sosUser:SosUser) {
        if(sosUser.role==1 || (sosUser.role == 2 && this.isScrumMasterEmpty)){
            let userProject :UserProject = {
                idDeveloper:0,
                idProject:0,
                isAppliance:false
            };

            this.subscription = this.usersProjectsService.updateDeveloperProjectIsAppliance(sosUser.id,this.idProjectActive,userProject)
                .pipe(
                    map(() => {
                        // Switch the project to an active project
                        let projectTmp:Project = {
                            "name": "",
                            "deadline": new Date(),
                            "description": "",
                            "repositoryUrl": "",
                            "status": 0
                        };
                        projectTmp.status = this.STATUS_ACTIVE;
                        projectTmp.id = this.idProjectActive;

                        this.projectService.updateStatus(projectTmp).subscribe();
                        this.deleteUserFromList(sosUser);
                        this.isScrumMasterEmpty = false;
                    })
                ).subscribe();
        }

    }

    // Refuse the apply of an user
    refuse(sosUser:SosUser) {
        this.subscription = this.usersProjectsService.deleteDeveloperProjectByidDeveloperByidProject(sosUser.id,this.idProjectActive).subscribe();
        this.deleteUserFromList(sosUser);
    }

    // Delete the user from appliedScrumMasters or appliedDevelopers array
    private deleteUserFromList(user: SosUser) {
        if(user.role == Role.ScrumMaster) {
            this.appliedScrumMasters = this.appliedScrumMasters.filter(element => {
                return element.id != user.id;
            });
        } else {
            this.appliedDevelopers = this.appliedDevelopers.filter(element => {
                return element.id != user.id;
            });
        }
    }

    toggleButtonPress(isPressed:boolean) {
        this.buttonIsPressed = isPressed;
    }

}
