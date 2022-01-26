import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ProjectsService } from "../../../services/projects/projects.service";
import { DatePipe } from "@angular/common";
import { SosUser } from "../../../domain/sos-user";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-project-preview',
    templateUrl: './project-preview.component.html',
    styleUrls: ['../../../app.component.css', './project-preview.component.css']
})
export class ProjectPreviewComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    isButtonPressed: boolean = false;
    assigned: boolean = false;

    userId: number = 0;
    projectId: number = 0;

    projectName: string | null = "";
    deadline: string | null  = "";
    description: string = "";

    datePipe = new DatePipe('en-GB');
    DATE_FORMAT: string = 'dd/MM/yyyy';
    currentUser: SosUser | undefined;

    constructor(private route: ActivatedRoute,
                private projectService: ProjectsService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.currentUser = <SosUser>JSON.parse(<string>localStorage.getItem('currentUser'));
        this.userId = (this.currentUser.id == undefined) ? 0 : this.currentUser.id;
        this.projectName = this.route.snapshot.paramMap.get("projectName");
        this.loadProjectInfo();
    }

    private loadProjectInfo() {
        this.subscription = this.getProject().subscribe();
    }

    // Get project information for the selected project
    private getProject() {
        return this.projectService.getByProjectName(this.projectName).pipe(
            map((project => {
                this.deadline = this.datePipe.transform(project.deadline, this.DATE_FORMAT);
                this.description = project.description;
                if (project.id != null) {
                    this.projectId = project.id;
                }
            })
        ));
    }

    toggleButtonPress(isPressed: boolean) {
        this.isButtonPressed = isPressed;
    }

}
