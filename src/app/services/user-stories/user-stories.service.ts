import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserStory} from "../../domain/user-story";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserStoriesService {
    constructor(private http: HttpClient) { }

    // Get requests
    getByIdProject(idProject: number): Observable<UserStory[]> {
        return this.http.get<UserStory[]>(`${environment.apiUrl}/userStories/byProject/${idProject}`);
    }

    getById(id: number): Observable<UserStory> {
        return this.http.get<UserStory>(`${environment.apiUrl}/userStories/byId/${id}`);
    }

    getByIdSprint(idSprint: number): Observable<UserStory[]> {
        return this.http.get<UserStory[]>(`${environment.apiUrl}/userStories/bySprint/${idSprint}`);
    }

    // Post requests
    addUserStory(userStory: UserStory): Observable<UserStory> {
        const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
        return this.http.post<UserStory>(`${environment.apiUrl}/userStories`, JSON.stringify(userStory),httpOptions);
    }

    // Put requests
    updateUserStory(userStory: UserStory, idUserStory:number) {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
        return this.http.put<UserStory>(`${environment.apiUrl}/userStories/update/${idUserStory}`, JSON.stringify(userStory), httpOptions);
    }

    // Delete requests
    deleteUserStory(userStory: UserStory): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.apiUrl}/userStories/${userStory.id}`);
    }

}
