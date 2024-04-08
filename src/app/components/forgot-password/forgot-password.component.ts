import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public submitButtonClicked: boolean;
  public userNameForm!: FormGroup;
  public passwordForm!: FormGroup;
  public showChild: boolean;
  public rsetPassword: boolean;
  public passwordResetUserName: string;
  public user: User | undefined;
  public userId: number;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private alertService: AlertService, private router: Router) {
    this.submitButtonClicked = false;
    this.createUserNameForm();
    this.createPasswordForm();
    this.showChild = false;
    this.rsetPassword = false;
    this.passwordResetUserName = "";
    this.userId = 0;

  }

  public ngOnInit(): void {
  }

  public createUserNameForm() {
    this.userNameForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }

  public createPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public forgotPassword() {
    this.submitButtonClicked = true;
    if (this.userNameForm.valid) {
      if (this.authenticationService.validUser(this.userNameForm.controls.username.value))
        this.rsetPassword = true;
    }
  }



  public resetPassword() {
    this.submitButtonClicked = true;
    if (this.passwordForm.valid)
      this.authenticationService.resetPassword(this.passwordForm.controls.password.value)
    else
      this.alertService.error("password reset unsuccessfull due to unexpected error");

  }
}


