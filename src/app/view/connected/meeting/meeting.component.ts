import { Component, OnInit } from '@angular/core';
import { CalendarOptions} from '@fullcalendar/angular';
import {MeetingsService} from "../../../services/meetings/meetings.service";
import {AuthenticationService} from "../../../services";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-meeting',
    templateUrl: './meeting.component.html',
    styleUrls: ['./meeting.component.css', '../../../app.component.css']
})
export class MeetingComponent implements OnInit {
    username: string = "";

    // Set calendar options (Size, style, values)
    calendarOptions: CalendarOptions = {
        height:700,
        initialView: 'dayGridMonth',
        eventClick : function (event) {
            localStorage.setItem('roomName', event.event.extendedProps.roomName);
        },
        weekends: false,
        locale: 'fr'
    };

    private meetingSubscription: Subscription | undefined;

    constructor(private meetingService: MeetingsService,
                private authenticationService: AuthenticationService) { }

    ngOnInit(): void {
        this.getUserInfo();
    }

    // Get all meetings event
    loadEvents(id: number) {
        this.meetingSubscription = this.meetingService.getByIdUser(id).subscribe(meetings => {
            let events = [];
            for (let i = 0; i < meetings.length; i++) {
                 events.push({
                     title: meetings[i].description,
                     date: meetings[i].schedule,
                     url : 'videocall',
                     roomName : meetings[i].meetingUrl
                 });
            }
            this.calendarOptions.events = events;
        });
    }

    // Get user firstname and user id
    private getUserInfo() {
        this.authenticationService.currentUser.subscribe(user => {
            if (user != null) {
                if (user.id != null) {
                    this.loadEvents(user.id);
                }
                this.username = user.firstname;
            }
        });
    }
}
