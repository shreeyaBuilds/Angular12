import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { User } from '../_models/user'
import { UserService } from './user.service';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public users!: User[];
    public loggedInUser: User;
    public userPasswordReset: User;
    public isValidUser: boolean;

    constructor(private http: HttpClient, private userService: UserService, private alertService: AlertService, private router: Router) {
        let user = null;
        let storageData = localStorage.getItem('currentUser');
        if (storageData) {
            console.log("storage ");
            console.dir(storageData);
            user = JSON.parse(storageData);
        }
        console.log("user authenticate " + user);
        console.dir(user);
        this.currentUserSubject = new BehaviorSubject<User>(user);
        this.currentUser = this.currentUserSubject.asObservable();
        userService.getAll().subscribe(response => {
            this.users = response;
        })
        console.log(this.users);
        this.loggedInUser = {} as User;
        this.userPasswordReset = {} as User;
        this.isValidUser = false;

    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        console.log("username : " + username);
        console.log("password: " + password);
        console.log(this.users)
        this.userService.getUserByUserNameAndPassword(username, password).pipe(first())
            .subscribe(
                user => {
                    if (user.length != 0) {
                        localStorage.setItem('currentUser', JSON.stringify(user[0]));
                        this.currentUserSubject.next(user[0]);
                        console.dir("print")
                        console.dir(user[0]);
                        this.router.navigate(['/home']);
                    }
                    else
                        this.alertService.error("Invalid Username and Password")
                },
                error => {
                    this.alertService.error("Something went wrong")
                })


    }
    public validUser(username: string) {
        this.userService.getUserByUserName(username).pipe(first())
            .subscribe(
                user => {
                    if (user.length != 0) {
                        this.userPasswordReset = user[0];
                        this.isValidUser = true;
                    }
                    else {
                        this.isValidUser = false;
                        this.alertService.error("Invalid Username")
                    }
                },
                error => {
                    this.alertService.error("Application encountered unexpected error")
                }
            )
        return this.isValidUser;
    }



    public resetPassword(password: string) {
        if (this.userPasswordReset.id) {
            this.userService.resetPwd(this.userPasswordReset.id, password).pipe(first()).subscribe(
                response => {
                    if (response != null) {
                        this.router.navigate(['/login']);
                        this.alertService.success("password reset successfull, login to continue ")
                    }
                    else
                        this.alertService.error("password reset unsuccessfull due to unexpected error")
                },
                error => {
                    this.alertService.error("password reset unsuccessfull due to unexpected error")
                })
        }
        else {
            this.alertService.error("password reset unsuccessfull due to unexpected error")
        }

    }
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null!);
    }
}