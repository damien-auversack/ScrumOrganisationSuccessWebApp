import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {AuthenticationService} from "../../../services";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../../../app.component.css', './login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;

    isButtonPressed: boolean = false;
    submitted: boolean = false;
    returnUrl: string = '/today';

    error: string = '';
    isError:boolean = false;
    title: string = "Login";

    form:FormGroup = this.fb.group({
        main: this.fb.group({
            email: this.fb.control('', [
                Validators.required, Validators.email
            ]),
            password: this.fb.control('', Validators.required)
        })
    });

    constructor(private fb: FormBuilder,
                private authenticationService: AuthenticationService,
                private router: Router) {
        // Redirect to home if it is already connected
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/login']);
        }
    }

    get controls() {
        return this.form.controls;
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
    ngOnInit(): void { }

    autoComplete() {
        this.form.setValue({
            main:{
                email:"florian.mazzeo@gmail.com",
                password:"scryper"
            }
        });
    }

    onSubmit() {
        this.submitted = true;
        let rawValue = this.form.getRawValue();

        // Login user
        this.subscription = this.authenticationService.login(rawValue.main.email, rawValue.main.password)
            .pipe(first())
            .subscribe(
                () => {
                    this.isError = false;
                    // Need to change the route based on the role of the user
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.isError = true;
                    this.error = error;
            });
    }

    toggleButtonPress(isPressed:boolean) {
        this.isButtonPressed = isPressed;
    }
}
