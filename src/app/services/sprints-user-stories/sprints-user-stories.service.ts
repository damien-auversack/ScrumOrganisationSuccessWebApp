import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {SprintUserStory} from "../../domain/sprint-user-story";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SprintsUserStoriesService {
    constructor(private http: HttpClient) { }

    // Get requests
    getByIdSprint(idSprint: number): Observable<SprintUserStory[]> {
        return this.http.get<SprintUserStory[]>(`${environment.apiUrl}/sprintsUserStories/byIdSprint/${idSprint}`);
    }

    // Post requests
    addSprintUserStory(sprintUserStory: SprintUserStory): Observable<SprintUserStory> {
        return this.http.post<SprintUserStory>(`${environment.apiUrl}/sprintsUserStories`, sprintUserStory);
    }
}
