import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { CartItem } from 'src/app/_models/cartItem.model';
import { User } from 'src/app/_models/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { OrderService } from 'src/app/_services/order.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Order } from 'src/app/_models/order.model';




@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit {

  public currentUser: User;
  public cartItems: Array<CartItem>;
  public cartItemsExists: boolean;
  public subTotal: number;
  public orderTotal: number;
  public tax: number;
  public shipping: number;
  public order: Order;
  constructor(private authenticationService: AuthenticationService,
    private orderService: OrderService, private alertService: AlertService, private settingsService: SettingsService, private router: Router) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    })
    this.cartItems = [];
    this.cartItemsExists = false;
    this.subTotal = 0;
    this.orderTotal = 0;
    this.tax = 0;
    this.shipping = 0
    this.order = {} as Order;
  }

  ngOnInit(): void {
    this.viewCart()
  }

  viewCart() {
    if (this.currentUser.id) {
      this.orderService.getCartItems(this.currentUser.id).pipe(first())
        .subscribe(
          items => {
            if (items.length != 0) {
              this.cartItems = items;
              this.cartItemsExists = true;
              for (let i = 0; i < this.cartItems.length; i++) {
                this.subTotal = this.subTotal + this.cartItems[i].itemPrice
              }
              this.tax = 10;
              this.shipping = 5

              this.orderTotal = this.subTotal + this.tax + this.shipping;
            }

          },
          error => {
            this.alertService.error("Cart Details are not shown due to unexpected error")
          })
    }
    else
      this.alertService.error("Your Session has expired, please login to continue")

  }

  removeFromCart(cartItem: CartItem) {
    if (this.subTotal != 0 && this.orderTotal != 0) {
      if (cartItem.qty > 1) {
        cartItem.qty = cartItem.qty - 1;
        cartItem.itemPrice = (cartItem.basePrice) * (cartItem.qty)
        this.subTotal = this.subTotal - cartItem.itemPrice;
        this.orderTotal = this.subTotal + this.shipping + this.tax;
        this.orderService.updateCart(cartItem.id, cartItem.qty, cartItem.itemPrice).pipe(first())
          .subscribe(
            response => {
              if (response != null) {
                this.alertService.success("Item removed from the cart successfully")
                this.fetchItemsFromCart();
              }
              else {
                this.alertService.error("Remove operation failed due to unexpected error")
              }

            },
            error => {
              this.alertService.error("Remove operation failed due to unexpected error")
            })
      }
      else {
        this.subTotal = this.subTotal - cartItem.itemPrice;
        this.orderTotal = this.subTotal + this.shipping + this.tax;
        this.orderService.deleteFromCart(cartItem.id).pipe(first())
          .subscribe(
            response => {

              if (response != null) {
                this.alertService.success("Item removed from the cart successfully")
                this.fetchItemsFromCart();
              }
              else
                this.alertService.error("Remove operation failed due to unexpected error")
            },
            error => {
              this.alertService.error("Remove operation failed due to unexpected error")

            })
      }
    }
    else {
      this.subTotal = 0;
      this.orderTotal = 0;
      this.tax = 0;
      this.shipping = 0;
      this.alertService.error("oops! Your Cart is empty")
      this.cartItemsExists = false;
    }
  }

  navigateToEditAddressMode() {
    this.settingsService.currentModeSubject.next('editMode')
    this.router.navigate(['/settings/address']);

  }

  navigateToEditPaymentMode() {
    this.settingsService.currentModeSubject.next('editMode')
    this.router.navigate(['/settings/payment']);
  }

  fetchItemsFromCart() {
    if (this.currentUser.id) {
      this.orderService.getCartItems(this.currentUser.id).pipe(first())
        .subscribe(
          items => {
            if (items.length != 0) {
              this.cartItems = items;
              this.cartItemsExists = true;
            }
            else
              this.cartItemsExists = false;

          },
          error => {
            this.alertService.error("Cart Details are not shown due to unexpected error")
          })
    }
    else
      this.alertService.error("Your Session has expired, please login to continue")

  }

  resetCartItems() {
    this.cartItems = [];

    this.router.navigate(['/home'])
  }
  placeOrder() {
    this.fetchItemsFromCart()

    if (this.currentUser.id) {
      this.order.userId = this.currentUser.id;
      this.order.feedId = uuidv4();
      this.order.orderstatus = 'process';
      this.order.paymentStatus = 'not paid';

      this.order.totalAmount = this.orderTotal
      this.orderService.currentOrderSubject.next(this.order);
      this.router.navigate(['/placeOrder/bank'])

    }

  }
}
