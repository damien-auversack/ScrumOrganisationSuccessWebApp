import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserStory} from "../../../domain/user-story";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SprintsService} from "../../../services/sprints/sprints.service";
import {ActivatedRoute} from "@angular/router";
import {SprintsUserStoriesService} from "../../../services/sprints-user-stories/sprints-user-stories.service";
import {UserStoriesService} from "../../../services/user-stories/user-stories.service";
import {UserService} from "../../../services";
import {MeetingsService} from "../../../services/meetings/meetings.service";
import {ParticipationService} from "../../../services/participation/participation.service";
import {Meeting} from "../../../domain/meeting";
import {Participation} from "../../../domain/participation";
import {DatePipe} from "@angular/common";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {ProjectsService} from "../../../services/projects/projects.service";

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['../../../app.component.css', './create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit, OnDestroy {
    isButtonSaveNewMeetingPressed: boolean = false;

    isInSprint: boolean[] = [];

    idSprint: number = 0;
    idProject: number = 0;
    sprintName: string | null = "";
    idMeeting: number = 0;
    idsUsersOnProject: number[] = [];

    userStories: UserStory[] = [];

    form: FormGroup = this.fb.group({
        newMeeting: this.fb.group({
            schedule: this.fb.control('', Validators.required),
            name: this.fb.control('', Validators.required),
            description: this.fb.control('', Validators.required)
        })
    });

    private subscription: Subscription | undefined;
    projectName: string | null = "";
    isDateOk: boolean = true;
    isBackButtonPressed: boolean = false;
    isAddingOfMeetingOk: boolean = false;
    meetingAlreadyExists: boolean = false;

    constructor(private fb: FormBuilder,
                private sprintService: SprintsService,
                private activatedRoute: ActivatedRoute,
                private sprintUserStoryService: SprintsUserStoriesService,
                private userStoryService: UserStoriesService,
                private userService: UserService,
                private meetingService: MeetingsService,
                private participationService: ParticipationService,
                private projectService: ProjectsService) { }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngOnInit(): void {
        let idSprintAsString: string | null = this.activatedRoute.snapshot.paramMap.get("sprintId");
        this.projectName = this.activatedRoute.snapshot.paramMap.get("projectName");

        // Cast to int because params are string by default
        if (typeof idSprintAsString === "string") {
            this.idSprint = parseInt(idSprintAsString, 10);
        }

        // Get the project ID and user IDs
        this.subscription = this.projectService.getByProjectName(this.projectName)
            .pipe(
                map(project => {
                    if (project.id != null) {
                        this.idProject = project.id
                    }
                    this.userService.getByIdProject(this.idProject).subscribe(users => {
                        for(let user of users) {
                            if (user.id != null) {
                                this.idsUsersOnProject.push(user.id);
                            }
                        }
                    });
                    this.sprintService.getById(this.idSprint).subscribe(sprint => this.sprintName = sprint.description);
                })
            ).subscribe();
    }

    onSubmitNewMeeting() {
        this.isDateOk = true;
        this.isAddingOfMeetingOk = false;
        this.meetingAlreadyExists = false;

        let rawValues = this.form.getRawValue().newMeeting;
        let meeting: Meeting = {
            idSprint: this.idSprint,
            schedule: rawValues.schedule,
            description: rawValues.description,
            meetingUrl: rawValues.name
        };

        // If the date is in the future
        if(new Date() < new Date(rawValues.schedule)) {
            // Add meeting, get ID meeting
            this.subscription = this.meetingService.addMeeting(meeting)
                .pipe(
                    map(meeting => {
                        if (meeting.id != null) {
                            this.idMeeting = meeting.id;
                        }
                        for(let idUser of this.idsUsersOnProject) {
                            let participation: Participation = {
                                idMeeting: this.idMeeting,
                                idUser: idUser
                            }
                            this.participationService.addParticipation(participation).subscribe();
                        }
                        this.isAddingOfMeetingOk = true;
                    })
                ).subscribe(() => {}, // ignore the result
                    error => { // display error on screen
                        this.meetingAlreadyExists = true;
                    }
                );
        } else {
            this.isDateOk = false;
        }
    }

    autoComplete() {
        let datePipe = new DatePipe('en-GB');
        let date = datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm');
        this.form.setValue({
            newMeeting:{
                schedule: date,
                name: "Meeting965147823452365",
                description: "Meeting test"
            }
        });
    }

    toggleBackButtonPress(isPressed: boolean) {
        this.isBackButtonPressed = isPressed;
    }
    toggleButtonSaveNewMeetingPressed(isPressed: boolean) {
        this.isButtonSaveNewMeetingPressed = isPressed;
    }
}
