import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Participation} from "../../domain/participation";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ParticipationService {
    constructor(private http: HttpClient) { }

    // Post requests
    addParticipation(participation: Participation): Observable<Participation> {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
        return this.http.post<Participation>(`${environment.apiUrl}/participations`, JSON.stringify(participation), httpOptions);
    }
}
