import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../../services";

@Injectable({
  providedIn: 'root'
})
export class VisitorGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if(!currentUser){
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/today'], { queryParams: { returnUrl: state.url } });
        return false
    }

}
