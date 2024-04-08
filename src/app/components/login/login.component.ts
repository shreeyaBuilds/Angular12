import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public submitButtonClicked: boolean;
  public userForm!: FormGroup;
  public showChild: boolean;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private alertService: AlertService, private router: Router) {
    this.submitButtonClicked = false;
    this.createForm();
    this.showChild = false;
  }

  public ngOnInit(): void {
  }



  public createForm() {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public login() {
    this.submitButtonClicked = true;
    if (this.userForm.valid) {
      this.authenticationService.login(this.userForm.controls.username.value, this.userForm.controls.password.value)


    }
  }


  public childButtonClicked() {
    this.submitButtonClicked = false;
    this.showChild = false;
    this.reset();
  }

  public reset() {
    this.userForm.reset();
  }



}
