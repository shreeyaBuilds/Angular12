import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AddressDetails } from 'src/app/_models/addressDetails';
import { User } from 'src/app/_models/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-add-update-address',
  templateUrl: './add-update-address.component.html',
  styleUrls: ['./add-update-address.component.scss']
})
export class AddUpdateAddressComponent implements OnInit {

  public submitButtonClicked: boolean;
  public addOrUpdateAddressForm!: FormGroup;
  public userNameExists: boolean;
  public user: User;
  public currentUser: User;
  public currentUserId: number | undefined;
  public houseNo: string;
  public city: string;
  public state: string;
  public landmark: string;
  public address: Array<AddressDetails>;
  public addressDetails: AddressDetails;
  public mode: String;
  public detailsPresent: boolean;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private alertService: AlertService, private authenticationService: AuthenticationService,
    private router: Router, private settingsService: SettingsService) {
    this.submitButtonClicked = false;
    this.createaddOrUpdateAddressForm();

    this.userNameExists = false;
    this.user = {} as User;
    this.currentUser = {} as User;
    this.houseNo = '';
    this.city = '';
    this.state = '';
    this.landmark = '';
    this.mode = '';
    this.address = [];
    this.addressDetails = {} as AddressDetails;
    this.detailsPresent = false;

    this.settingsService.currentMode.subscribe(mode => {
      this.mode = mode;
      if (this.mode == "viewMode") { this.viewUserAddress(); }
      if (this.mode == "editMode")
        this.addOrUpdateAddressForm.reset();
    });

  }

  public ngOnInit(): void {

  }



  public createaddOrUpdateAddressForm() {
    this.addOrUpdateAddressForm = this.formBuilder.group({
      houseNo: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      landmark: ['', [Validators.required]],
    });
  }


  public updateAddress() {
    this.submitButtonClicked = true;
    if (this.addOrUpdateAddressForm.valid) {
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
        this.currentUserId = this.currentUser.id;
      })
      if (this.currentUser.id) {
        this.addressDetails.houseNo = this.addOrUpdateAddressForm.controls.houseNo.value;
        this.addressDetails.city = this.addOrUpdateAddressForm.controls.city.value;
        this.addressDetails.state = this.addOrUpdateAddressForm.controls.state.value;
        this.addressDetails.landmark = this.addOrUpdateAddressForm.controls.landmark.value;
        this.address.push(this.addressDetails)
        this.userService.updateAddress(this.currentUser.id, this.address).pipe(first())
          .subscribe(
            response => {
              if (response != null) {
                this.alertService.success("Address updated successfully")
                this.settingsService.currentModeSubject.next('viewMode')
              }
              else
                this.alertService.error("Address updation failed due to unexpected error")

            },
            error => {
              this.alertService.error("Address updation failed due to unexpected error")
            })
      }

      else
        this.alertService.error("Your session has expired, please login again")

    }
  }


  public viewUserAddress() {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.currentUserId = this.currentUser.id;

    })
    if (this.currentUserId) {
      this.userService.getUserByUserId(this.currentUserId).pipe(first())
        .subscribe(
          user => {
            if (user != null && user.address != undefined) {
              this.detailsPresent = true;
              this.houseNo = user.address[0].houseNo;
              this.city = user.address[0].city;
              this.state = user.address[0].state;
              this.landmark = user.address[0].landmark;

            }
            else { 

            }
          },
          error => {
            this.alertService.error("Details are not shown due to unexpected error")
          })
    }
  }
}
