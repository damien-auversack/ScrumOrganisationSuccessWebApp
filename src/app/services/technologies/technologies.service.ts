import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Technology} from "../../domain/technology";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TechnologiesService {
    constructor(private http: HttpClient) { }

    // Get requests
    getAll(): Observable<Technology[]> {
        return this.http.get<Technology[]>(`${environment.apiUrl}/technology`);
    }
}
