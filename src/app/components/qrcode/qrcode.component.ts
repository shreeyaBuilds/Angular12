import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Order } from 'src/app/_models/order.model';
import { User } from 'src/app/_models/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {

  public order = {} as Order;
  public btnText: string;
  public currentUser!: User;
  constructor(private orderService: OrderService, private alerService: AlertService, private router: Router, private authenticationService: AuthenticationService) {

    this.btnText = 'Pay';
    this.orderService.currentOrderSubject.subscribe(x => {
      this.order = x;
      this.currentUser = {} as User;

      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
      });

      if (this.order.totalAmount > 0)
        this.btnText = 'Pay' + ' $' + this.order.totalAmount;
      else {
        this.router.navigate(['/home'])
        alerService.error('Please add items in cart before placing order')
      }
    });
  }

  ngOnInit(): void {
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
            this.deleteItemsFromCart(this.currentUser.id);
            this.router.navigate(['/track'])
            this.alerService.success("Order Placed Successfully, Your cart is empty now");
          }
          else
            this.alerService.error("Oops, Order was not placed, Please try again");

        },
        error => {
          this.alerService.error("Order Placement Unsuccessfull due to unexpected error")
        })
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
                    this.alerService.error("Remove operation failed due to unexpected error")
                },
                error => {
                  this.alerService.error("Remove operation failed due to unexpected error")

                })
            }

          }
        },
        error => {
          this.alerService.error("Order Placement Unsuccessfull due to unexpected error, please try again")
        })

  }
}
