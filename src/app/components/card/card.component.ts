import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Order } from 'src/app/_models/order.model';
import { Payment } from 'src/app/_models/payment';
import { User } from 'src/app/_models/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { OrderService } from 'src/app/_services/order.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  public order = {} as Order;
  public currentUser: User;
  public currentUserId: number | undefined;
  public cardDetails: Array<Payment>;
  public showCardDetails: boolean;
  public name: string;
  public creditCardNumber: string;
  public cvv: string;
  public year: number;
  public month: string;
  public iconImages: Array<string>;
  public paymentDetails: Payment;
  public cardform!: FormGroup;
  public btnText: string;


  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private userService: UserService, private alertService: AlertService, private orderService: OrderService, private router: Router) {
    this.currentUser = {} as User;
    this.iconImages = [];
    this.cardDetails = [];
    this.showCardDetails = false;
    this.name = '';
    this.creditCardNumber = '';
    this.cvv = '';
    this.year = new Date().getFullYear();
    this.month = '';
    this.paymentDetails = {} as Payment;
    this.cardForm();
    this.btnText = "Pay";

    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
    this.orderService.currentOrderSubject.subscribe(x => {
      //console.log("Received : " + x);
      this.order = x;
      if (this.order.totalAmount > 0)
        this.btnText = 'Pay' + ' $' + this.order.totalAmount;
      else {
        this.router.navigate(['/home'])
        alertService.error('Please add items in cart before placing order')
      }
    });
  }

  ngOnInit(): void {
    this.getUserPaymentDetails();
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
  chooseNewCard() {
    this.showCardDetails = false;

  }

  pay() {

    let today = new Date();
    let time = today.getTime();
    this.order.orderstatus = "placed";
    this.order.paymentStatus = "paid";
    this.order.orderDate = today;
    this.order.orderTime = time;
    this.orderService.placeOrder(this.order).pipe(first())
      .subscribe(
        item => {
          if (item != null && this.currentUser.id) {
            this.orderService.currentOrderSubject.next(this.order);
            this.deleteItemsFromCart(this.currentUser.id)

            this.router.navigate(['/track'])
            this.alertService.success("Order Placed Successfully, Your cart is empty now");


          }
          else
            this.alertService.error("Oops, Order was not placed, Please try again");

        },
        error => {
          this.alertService.error("Order Placement Unsuccessfull due to unexpected error")
        })
  }
  getUserPaymentDetails() {

    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.currentUserId = this.currentUser.id;

    })
    if (this.currentUserId) {
      this.userService.getUserByUserId(this.currentUserId).pipe(first())
        .subscribe(
          user => {
            if (user != null && user.payment != undefined) {

              for (let i = 0; i < user.payment.length; i++) {
                this.cardDetails.push(user.payment[i])
                this.iconImages.push("assets/images/credit-card.png");
              }

            }
            else {
              this.alertService.error("Card Details not present, Please add card details by going to settings option-(add/view payment)")

            }
          },
          error => {
            this.alertService.error("Your session has expired, please login again")
          })
    }
  }
  getCardDetails(i: number) {
    this.showCardDetails = true;
    this.paymentDetails = this.cardDetails[i];
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

  deleteItemsFromCart(id: number) {
    this.orderService.getCartItems(id).pipe(first())
      .subscribe(
        items => {
          if (items.length != 0) {
            for (let i = 0; i < items.length; i++) {
              this.orderService.deleteFromCart(items[i].id).pipe(first())
              .subscribe(
                response => {

                  if (response != null) {
                  }
                  else
                    this.alertService.error("Remove operation failed due to unexpected error")
                },
                error => {
                  this.alertService.error("Remove operation failed due to unexpected error")

                })
            }

          }
        },
        error => {
          this.alertService.error("Order Placement Unsuccessfull due to unexpected error, please try again")
        })

  }

}

