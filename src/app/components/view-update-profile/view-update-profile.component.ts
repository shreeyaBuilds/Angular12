import { Component, getModuleFactory, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-view-update-profile',
  templateUrl: './view-update-profile.component.html',
  styleUrls: ['./view-update-profile.component.scss']
})
export class ViewUpdateProfileComponent implements OnInit {


  public submitButtonClicked: boolean;
  public viewupdateprofileform!: FormGroup;
  public userNameExists: boolean;
  public user: User;
  public currentUser: User;
  public currentUserId: number | undefined;
  public userFirstName: string;
  public userLastName: string;
  public userEmail: string;
  public mode: string;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService, private router: Router, private settingsService: SettingsService) {
    this.submitButtonClicked = false;
    this.createViewAndUpdateForm();
    this.userNameExists = false;
    this.user = {} as User;
    this.currentUser = {} as User;
    this.userFirstName = '';
    this.userLastName = '';
    this.userEmail = '';
    this.mode = '';


    this.settingsService.currentMode.subscribe(mode => {
      this.mode = mode;
      if (this.mode == "viewMode") { this.viewUser(); }
      if (this.mode == "editMode")
        this.viewupdateprofileform.reset();
    });
  }

  public ngOnInit(): void {
  }



  public createViewAndUpdateForm() {
    this.viewupdateprofileform = this.formBuilder.group({
      fname: ['', []],
      lname: ['', []],
      email: ['', [Validators.email]],
      password: ['', []],
    });
  }


  public updateProfile() {
    this.submitButtonClicked = true;
    if (this.viewupdateprofileform.valid) {

      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
        this.currentUserId = this.currentUser.id;

      })


      if (this.currentUser.id)
        this.userService.updateProfile(this.currentUser.id, this.viewupdateprofileform.controls.fname.value, this.viewupdateprofileform.controls.lname.value, this.viewupdateprofileform.controls.email.value,
          this.viewupdateprofileform.controls.password.value).pipe(first()).subscribe(

            response => {
              if (response != null) {
                this.alertService.success("Profile updated successfully")
                this.settingsService.currentModeSubject.next('viewMode')
              }
              else
                this.alertService.error("Profile updation failed due to unexpected error")

            },
            error => {
              this.alertService.error("Profile updation failed due to unexpected error")
            })

    }

    else
      this.alertService.error("Your session has expired, please login again to update profile")


  }

  public viewUser() {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.currentUserId = this.currentUser.id;

    })
    if (this.currentUserId)
      this.userService.getUserByUserId(this.currentUserId).pipe(first())
        .subscribe(
          user => {
            if (user != null && user.fname && user.lname && user.email) {
              this.userFirstName = user.fname;
              this.userLastName = user.lname;
              this.userEmail = user.email;
            }
            else
              this.alertService.error("Details not present")

          },
          error => {
            this.alertService.error("Details are not shown due to unexpected error")
          })
  }
}

