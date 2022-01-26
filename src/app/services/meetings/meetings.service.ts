import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Meeting} from "../../domain/meeting";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MeetingsService {
    constructor(private http: HttpClient) { }

    // Get requests
    getByIdUser(idUser: number): Observable<Meeting[]> {
        return this.http.get<Meeting[]>(`${environment.apiUrl}/meetings/byUser/${idUser}`);
    }

    // Post requests
    addMeeting(meeting: Meeting): Observable<Meeting> {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
        return this.http.post<Meeting>(`${environment.apiUrl}/meetings`, JSON.stringify(meeting), httpOptions);
    }
}
