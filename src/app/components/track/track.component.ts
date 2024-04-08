import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Order } from 'src/app/_models/order.model';
import { User } from 'src/app/_models/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {

  public order = {} as Order;
  public orderId: string;
  public orderStatus: string | undefined;
  public orderDate: Date | undefined;
  public orderTime: number | undefined;
  public paymentStatus: string | undefined;
  public orderIdSearchInput: string;
  public currentUser = {} as User;
  public liveStatus: boolean

  constructor(private orderService: OrderService, private alertService: AlertService, private authenticationService: AuthenticationService) {

    this.orderId = '';
    this.orderStatus = '';
    this.orderDate = new Date();
    this.orderTime = new Date().getTime();
    this.paymentStatus = '';
    this.orderIdSearchInput = '';
    this.liveStatus = false;
    this.orderService.currentOrderSubject.subscribe(x => {
      this.order = x;
      this.orderStatus = this.order.orderstatus;
      this.orderId = this.order.feedId;
      this.orderDate = this.order.orderDate;
      this.orderTime = this.order.orderTime;
      this.paymentStatus = this.order.paymentStatus;


    })

    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
  }

  getStatus() {
    if (this.orderIdSearchInput)
      this.orderService.getOrderByFeedId(this.orderIdSearchInput).pipe(first()).subscribe(
        order => {
          if (order.length != 0) {
            this.orderStatus = order[0].orderstatus;
            this.orderId = order[0].feedId;
            this.orderDate = order[0].orderDate;
            this.orderTime = order[0].orderTime;
            this.paymentStatus = order[0].paymentStatus;
            this.alertService.success("Hurray!, here are your order details")
          }
          else
            this.alertService.error("Sorry Could not fetch the order details")
        },
        error => {

          this.alertService.error("An unexpected error occured, please login in")
        }
      )

  }

  getLiveStatus() {
    this.liveStatus = true;
  }
}
