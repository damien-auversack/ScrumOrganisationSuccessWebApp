import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService, UserService } from "../../../services";
import { ActivatedRoute, Router } from "@angular/router";
import {SignUpService} from "../../../services/sign-up/sign-up.service";
import {DatePipe} from "@angular/common";
import {SosUser} from "../../../domain/sos-user";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['../../../app.component.css', './sign-up.component.css']
})
export class SignUpComponent implements OnInit {
    title: string = "Create an account";
    buttonIsPressed: boolean = false;
    userExists: boolean = false;

    differentPasswords: boolean = false;
    accountCreationSuccessful: boolean = false;
    isMajor: boolean = true;

    typeUserNames:string[] = [
        "Developer",
        "ScrumMaster",
        "ProductOwner"
    ]

    form:FormGroup = this.fb.group({
        email:this.fb.control('', [
            Validators.required, Validators.email
        ]),
        password:this.fb.control('', Validators.required),
        confirmPassword:this.fb.control('', Validators.required),
        lastname: this.fb.control('', Validators.required),
        firstname: this.fb.control('', Validators.required),
        birthdate: this.fb.control('', Validators.required),
        userType: this.fb.control('Developer')
    })

    constructor(private fb: FormBuilder,
                private authenticationService : AuthenticationService,
                private route: ActivatedRoute,
                private router : Router,
                private userService : UserService,
                private signUpService : SignUpService) { }

    ngOnInit(): void { }

    onSubmit() {
        // Reset the error messages
        this.userExists = false;

        // Get the value of the email
        let email: string =this.form.getRawValue().email;
        let password: string = this.form.getRawValue().password;
        let passwordConfirmation: string = this.form.getRawValue().confirmPassword;

        // Verify if the passwords are the same
        if(password == passwordConfirmation) {
            this.differentPasswords = false;
            this.signUpService.setValues(password, email);
            // Verify if the email is in the database
            this.userService.getByEmail(email).subscribe(result => {
                if(result == null) {
                     this.sendData();
                 }
                 else {
                     this.userExists = true;
                 }
             });
        } else {
            this.differentPasswords = true;
        }
    }

    autoComplete() {
        let datePipe = new DatePipe('en-GB');
        let date = datePipe.transform(new Date(1998,11,26), 'yyyy-MM-dd');
        this.form.setValue({
            email: "Florian@test.com",
            password: "test",
            confirmPassword: "test",
            lastname: "Florian",
            firstname: "test",
            birthdate: date,
            userType: "Developer"
        })
    }

    sendData() {
        // Set user values
        let rawValues = this.form.getRawValue();
        let birthdateUser: Date = new Date(rawValues.birthdate);
        let user: SosUser = {
            firstname: rawValues.firstname,
            lastname: rawValues.lastname,
            password: this.signUpService.password,
            email: this.signUpService.email,
            role: this.typeUserNames.indexOf(rawValues.userType) + 1,
            birthdate: birthdateUser
        };

        let date: Date = new Date();
        let currentYear: number = date.getFullYear();
        let birthYear: number = birthdateUser.getFullYear();
        let offset: number;

        // If the user's birthday month has already passed
        if(date.getMonth() < birthdateUser.getMonth()) {
            offset = -1;
        } else if(date.getMonth() == birthdateUser.getMonth()
            && date.getDay() < birthdateUser.getDay()) {
            offset = -1;
        } else {
            offset = 0;
        }

        this.isMajor = (currentYear - birthYear + offset) >= 18;
        if(this.isMajor) {
            this.userService.addUser(user).subscribe(() => {
                 this.accountCreationSuccessful = true;
                 this.resetFormValues();
             });
        }
    }

    // Reset form values
    private resetFormValues() {
        this.form.setValue({
            email: "",
            password: "",
            confirmPassword: "",
            lastname: "",
            firstname: "",
            birthdate: "",
            userType: ""
        });
    }
    // find if the form is invalid
    public computeInvalidForm(){
        const invalid = [];
        const controls = this.form.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;
    }

    public findInvalidControls() {
        let invalid = this.computeInvalidForm();
        return invalid[0]=="email";
    }

    toggleButtonPressed(isPressed: boolean) {
        this.buttonIsPressed = isPressed;
    }
}
