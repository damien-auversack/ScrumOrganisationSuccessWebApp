import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserTechnology} from "../../domain/user-technology";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UsersTechnologiesService {
    constructor(private http: HttpClient) { }

    // Get requests
    getByUserId(id: number): Observable<UserTechnology[]> {
        return this.http.get<UserTechnology[]>(`${environment.apiUrl}/userTechnologies/byUser/${id}`);
    }

    // Post requests
    addUserTechnology(userTechnology: UserTechnology): Observable<UserTechnology> {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
        return this.http.post<UserTechnology>(`${environment.apiUrl}/userTechnologies`, JSON.stringify(userTechnology), httpOptions);
    }

    // Delete requests
    deleteUserTechnology(idDeveloper: number, idTechnology: number): Observable<UserTechnology> {
        return this.http.delete<UserTechnology>(`${environment.apiUrl}/userTechnologies/${idDeveloper},${idTechnology}`);
    }
}
