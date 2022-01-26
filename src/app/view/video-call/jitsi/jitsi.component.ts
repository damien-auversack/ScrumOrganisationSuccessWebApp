import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SosUser} from "../../../domain/sos-user";

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi',
  templateUrl: './jitsi.component.html',
  styleUrls: ['./jitsi.component.css']
})
export class JitsiComponent implements OnInit {

    domain: string = "meet.jit.si";
    room: any;
    options: any;
    api: any;
    user: any;
    currentUser: SosUser = null!;
    userName: string = '';

    // For Custom Controls
    isAudioMuted = false;
    isVideoMuted = false;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        this.room = <string>localStorage.getItem('roomName'); // Set your room name
        this.currentUser = <SosUser>JSON.parse(<string>localStorage.getItem('currentUser'));
        this.userName = (this.currentUser.firstname==undefined)?"":this.currentUser.firstname;
        this.user = {
            name: this.userName // Set your username
        }
    }

    ngAfterViewInit(): void {
        this.options = {
            roomName: this.room,
            width: 1500,
            height: 800,
            configOverwrite: {prejoinPageEnabled: false},
            interfaceConfigOverwrite: {},
            parentNode: document.querySelector('#jitsi-iframe'),
            userInfo: {
               displayName: this.user.name
            }
        }

        this.api = new JitsiMeetExternalAPI(this.domain, this.options);

        // Event handlers
        this.api.addEventListeners({
            readyToClose: this.handleClose,
            participantLeft: this.handleParticipantLeft,
            participantJoined: this.handleParticipantJoined,
            videoConferenceJoined: this.handleVideoConferenceJoined,
            videoConferenceLeft: this.handleVideoConferenceLeft,
            audioMuteStatusChanged: this.handleMuteStatus,
            videoMuteStatusChanged: this.handleVideoStatus
        });
    }

    handleClose = () => {
        console.log("handleClose");
    }
    handleParticipantLeft = async (participant: any) => {
        console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
        const data = await this.getParticipants();
    }
    handleParticipantJoined = async (participant: any) => {
        console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
        const data = await this.getParticipants();
    }
    handleVideoConferenceJoined = async (participant: any) => {
        console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
        const data = await this.getParticipants();
    }
    handleVideoConferenceLeft = () => {
        console.log("handleVideoConferenceLeft");
        this.router.navigate(['/meetings']);
    }
    handleMuteStatus = (audio: any) => {
        console.log("handleMuteStatus", audio); // { muted: true }
    }
    handleVideoStatus = (video: any) => {
        console.log("handleVideoStatus", video); // { muted: true }
    }

    getParticipants() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.api.getParticipantsInfo()); // get all participants
            }, 500)
        });
    }

    executeCommand(command: string) {
        this.api.executeCommand(command);;
        if(command == 'toggleAudio') {
            this.isAudioMuted = !this.isAudioMuted;
        }
        if(command == 'toggleVideo') {
            this.isVideoMuted = !this.isVideoMuted;
        }
    }
}
