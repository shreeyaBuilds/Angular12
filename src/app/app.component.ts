import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Order } from './_models/order.model';
import { User } from './_models/user';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { OrderService } from './_services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Foody';
  currentUser!: User | null;


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService, private alertService: AlertService, private orderService: OrderService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  getOrders() {
    if (this.currentUser != null && this.currentUser.id) {
      this.orderService.getOrderByUserId(this.currentUser.id).pipe(first()).subscribe(
        order => {
          if (order.length != 0) {
            this.router.navigate(['/track'])
            this.alertService.success("Woohoo!! You can search all your orders from here")
          }
          else
            this.alertService.error("Sorry, You haven't placed any order yet! Please place an order to enable the live order tracking page")
        },
        error => {
          this.alertService.error("Sorry, unexpected error is encountere, request you to please login again")
        })

    }
    else {
      this.alertService.error("Your session is expired request you to please login again")
    }

  }
}
