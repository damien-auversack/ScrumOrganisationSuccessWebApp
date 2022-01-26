import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SosComment } from "../../domain/sos-comment";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    constructor(private http: HttpClient) { }

    // Get requests
    getByIdUserStory(idUserStory: number): Observable<SosComment[]> {
        return this.http.get<SosComment[]>(`${environment.apiUrl}/comments/byUserStory/${idUserStory}`);
    }

    // Post requests
    addComment(comment: SosComment): Observable<SosComment> {
        return this.http.post<SosComment>(`${environment.apiUrl}/comments`, comment);
    }
}
