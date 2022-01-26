import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Sprint } from "../../domain/sprint";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SprintsService {
    constructor(private http: HttpClient) { }

    // Get requests
    getByIdProject(idProject: number): Observable<Sprint[]> {
        return this.http.get<Sprint[]>(`${environment.apiUrl}/sprints/byProject/${idProject}`);
    }

    getById(id: number): Observable<Sprint> {
        return this.http.get<Sprint>(`${environment.apiUrl}/sprints/byId/${id}`);
    }

    getMaxNumberOfSprints(idProject: number): Observable<number> {
        return this.http.get<number>(`${environment.apiUrl}/sprints/getMaxSprintNumber/${idProject}`);
    }

    // Post requests
    addSprint(sprint: Sprint): Observable<Sprint> {
        return this.http.post<Sprint>(`${environment.apiUrl}/sprints`, sprint);
    }
}
