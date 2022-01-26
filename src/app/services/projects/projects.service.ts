import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Project } from "../../domain/project";
import { environment } from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {
    constructor(private http: HttpClient) { }

    // Get requests
    getById(id: number): Observable<Project> {
        return this.http.get<Project>(`${environment.apiUrl}/projects/byId/${id}`);
    }

    getByProjectName(projectName: string | null): Observable<Project> {
        return this.http.get<Project>(`${environment.apiUrl}/projects/byName/${projectName}`);
    }

    getByIdUserActiveProject(idUser : number) : Observable<Project[]>{
        return this.http.get<Project[]>(`${environment.apiUrl}/projects/activeByIdUser/${idUser}`);
    }

    getActiveProject() : Observable<Project[]>{
        return this.http.get<Project[]>(`${environment.apiUrl}/projects/active/`);
    }

    getByIdUserNotFinishedIsLinked(idUser : number) : Observable<Project[]>{
        return this.http.get<Project[]>(`${environment.apiUrl}/projects/byIdUserNotFinishedIsLinked/${idUser}`);
    }

    // Post requests
    addProject(project: Project): Observable<Project> {
        const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
        return this.http.post<Project>(`${environment.apiUrl}/projects`, JSON.stringify(project),httpOptions);
    }

    // Put requests
    updateStatus(project: Project) {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
        return this.http.put<Project>(`${environment.apiUrl}/projects/updateStatus/${project.id}`, JSON.stringify(project), httpOptions);
    }
}
