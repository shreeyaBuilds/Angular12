import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AlertService } from 'src/app/_services/alert.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public submitButtonClicked: boolean;
  public userForm!: FormGroup;
  public showChild: boolean;
  public userNameExists: boolean;
  public user: User;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private alertService: AlertService, private router: Router) {
    this.submitButtonClicked = false;
    this.createForm();
    this.showChild = false;
    this.userNameExists = false;
    this.user = {} as User;


  }

  public ngOnInit(): void {
  }
  public createForm() {
    this.userForm = this.formBuilder.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      TermsAccepted: ['', [Validators.requiredTrue]]
    });
  }

  public register() {
    this.submitButtonClicked = true;
    if (this.userForm.valid) {
      this.userService.getUserByUserName(this.userForm.controls.email.value)
        .pipe(first())
        .subscribe(
          data => {
            if (data.length == 0) {
              this.user = {
                "fname": this.userForm.controls.fname.value,
                "lname": this.userForm.controls.lname.value,
                "email": this.userForm.controls.email.value,
                "password": this.userForm.controls.password.value
              }

              this.userService.register(this.user).pipe(first())
                .subscribe(
                  data => {
                    console.log(data)
                    this.router.navigate(['/login']);
                    this.alertService.success("Registration Successfull, Please login to continue");
                  },
                  error => {
                    this.alertService.error("Registration Failed")
                  }
                )
            }
            else
              this.alertService.success("Username already exists, please register with different new username or login")
          },
          error => {
            this.alertService.error("Registration Failed")
          })
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
