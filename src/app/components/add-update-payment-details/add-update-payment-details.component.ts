import { getLocaleMonthNames } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Payment } from 'src/app/_models/payment';
import { User } from 'src/app/_models/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-add-update-payment-details',
  templateUrl: './add-update-payment-details.component.html',
  styleUrls: ['./add-update-payment-details.component.scss']
})
export class AddUpdatenoOfPaymentsComponent implements OnInit {


  public today: Date;
  public currentYear: number;
  public months: String[];
  public years: number[];
  public maxYear: number;
  public monthsOfCurrentYear: String[];
  public addorupdatepaymentdetailsform!: FormGroup;
  public currentUser: User;
  public payments: Array<{}>;
  public submitButtonClicked: boolean;
  public payment: Payment;
  public viewMode: boolean;
  public editMode: boolean;
  public mode: String;
  public currentUserId: number | undefined;
  public noOfPayments: Array<Payment>;
  public iconImages: Array<string>;
  public showCardDetails: boolean;
  public paymentDetails: Payment;
  public name: string;
  public creditCardNumber: string;
  public cvv: string;
  public year: number;
  public month: string;
  public cardform!: FormGroup;
  public cUser!: User;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService,
    private userService: UserService, private alertService: AlertService, private settingsService: SettingsService) {
    this.today = new Date();
    this.currentYear = this.today.getFullYear();
    this.months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY',
      'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    this.maxYear = new Date(this.today.setFullYear(this.today.getFullYear() + 20)).getFullYear();
    this.years = [];
    this.getYears();
    this.monthsOfCurrentYear = ['JUNE', 'JULY',
      'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
    this.addnoOfPaymentsForm();
    this.currentUser = {} as User;
    this.payments = [];
    this.submitButtonClicked = false;
    this.payment = {} as Payment;
    this.viewMode = false;
    this.editMode = false;
    this.mode = '';
    this.noOfPayments = [];
    this.iconImages = [];
    this.showCardDetails = false;
    this.paymentDetails = {};
    this.name = '';
    this.creditCardNumber = '';
    this.cvv = '';
    this.year = new Date().getFullYear();
    this.month = '';
    this.cardForm();
    this.cUser = {} as User;


    this.settingsService.currentMode.subscribe(mode => {
      this.mode = mode;
      if (this.mode == "viewMode") { this.viewnoOfPayments(); }
      if (this.mode == "editMode") { this.addorupdatepaymentdetailsform.reset(); }
    });
  }

  ngOnInit(): void {
  }
  cardForm() {
    this.cardform = this.formBuilder.group({
      name: [''],
      creditCardNumber: [''],
      year: [''],
      month: [''],
      cvv: [''],
    });
    this.cardform.controls['name'].disable();
    this.cardform.controls['creditCardNumber'].disable();
    this.cardform.controls['cvv'].disable();
    this.cardform.controls['year'].disable();
    this.cardform.controls['month'].disable();
  }
  getYears() {
    for (var x = this.currentYear; x <= this.maxYear; x++) {
      this.years.push(x);

    }
  }

  getMonths() {
    if (this.cardform.controls['year'].value != undefined && this.cardform.controls['year'].value == '2022')
      this.months = this.monthsOfCurrentYear;
  }


  public addnoOfPaymentsForm() {
    this.addorupdatepaymentdetailsform = this.formBuilder.group({
      name: ['', [Validators.required]],
      creditCardNumber: ['', [Validators.required, this.creditCardNumberValidator]],
      year: ['', [Validators.required]],
      month: ['', [Validators.required]],
      cvv: ['', [Validators.required, this.cvvNumberValidator]],
    });
  }


  public creditCardNumberValidator(c: AbstractControl) {
    let creditCardNumber = "" + c.value;
    if (creditCardNumber == "") {
      return null;
    }
    return creditCardNumber.length != 12 ? { creditcardNumberlengthMismatch: true } : null;
  }

  public cvvNumberValidator(c: AbstractControl) {
    let cvv = "" + c.value;
    if (cvv == "") {
      return null;
    }
    return cvv.length != 3 ? { cvvlengthMismatch: true } : null;
  }

  public updatenoOfPayments() {
    this.submitButtonClicked = true;
    if (this.addorupdatepaymentdetailsform.valid) {
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
      })
      if (this.currentUser.id) {
        this.payment.name = this.addorupdatepaymentdetailsform.controls.name.value;
        this.payment.creditCardNumber = this.addorupdatepaymentdetailsform.controls.creditCardNumber.value;
        this.payment.year = this.addorupdatepaymentdetailsform.controls.year.value;
        this.payment.month = this.addorupdatepaymentdetailsform.controls.month.value;
        this.payment.cvv = this.addorupdatepaymentdetailsform.controls.cvv.value;
        this.userService.getUserByUserId(this.currentUser.id).pipe(first()).subscribe(
          user => {
            if (user != null) {
              this.cUser = user;

              if (this.cUser.payment && this.cUser.payment.length !=0) {

                this.payments = this.cUser.payment;

                this.payments.push(this.payment)
              }
              else {
               
                this.payments.push(this.payment)
              }
              if (this.currentUser.id) {
                this.userService.updatePaymentDetails(this.currentUser.id, this.payments).pipe(first()).subscribe(
                  response => {
                    if (response != null) {
                      this.alertService.success("Payment Details updated successfully")
                      this.settingsService.currentModeSubject.next('viewMode')
                    }
                    else
                      this.alertService.error("Payment details updation failed due to unexpected error")

                  },
                  error => {
                    this.alertService.error("payment details updation failed due to unexpected error")
                  })
              }
            }

            else
              this.alertService.error("Your session has expired, please login again to update profile")
          },

          error => {
            this.alertService.error("Your session has expired, please login again to update profile")
          })


      }
    }


  }

  viewnoOfPayments() {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.currentUserId = this.currentUser.id;

    })
    if (this.currentUserId) {
      this.userService.getUserByUserId(this.currentUserId).pipe(first())
        .subscribe(
          user => {
            if (user != null && user.payment != undefined) {
              this.iconImages = [];

              for (let i = 0; i < user.payment.length; i++) {
                this.noOfPayments.push(user.payment[i])
                this.iconImages.push("assets/images/credit-card.png");
              }

            }
            else {
              this.alertService.error("Payment Details not present, Please add payment details by clicking on edit mode")

            }
          },
          error => {
            this.alertService.error("Details are not shown due to unexpected error")
          })
    }
  }


  resetPaymentForm() {
    this.addorupdatepaymentdetailsform.reset();
  }
  getCardDetails(i: number) {
    this.showCardDetails = true;
    this.paymentDetails = this.noOfPayments[i];
    this.name = this.paymentDetails.name ? this.paymentDetails.name : '';
    this.creditCardNumber = this.paymentDetails.creditCardNumber ? this.paymentDetails.creditCardNumber : '';
    this.cvv = this.paymentDetails.cvv ? this.paymentDetails.cvv : '123';
    this.year = this.paymentDetails.year ? this.paymentDetails.year : new Date().getFullYear();
    this.month = this.paymentDetails.month ? this.paymentDetails.month : 'January';
    this.cardform.controls.name.setValue(this.name);
    this.cardform.controls.creditCardNumber.setValue(this.creditCardNumber);
    this.cardform.controls.cvv.setValue(this.cvv);
    this.cardform.controls.year.setValue(this.year);
    this.cardform.controls.month.setValue(this.month);
  }
  viewNewCard() {
    this.showCardDetails = false;

  }

  fetchPayments() {

  }

}
