import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { IFoodDetails } from 'src/app/_models/food.model';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FoodListService } from 'src/app/_services/foodlist.service';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/_services/order.service';
import { Order } from 'src/app/_models/order.model';
import { CartItem } from 'src/app/_models/cartItem.model';
import { AlertService } from 'src/app/_services/alert.service';
import { v4 as uuidv4 } from 'uuid';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit {

  currentUser: User;
  users: User[] = [];
  public foodDetails: IFoodDetails[];
  public filterByRestaurantNameOrDishName: string;
  public addToCartTemplateType: boolean;
  public food: IFoodDetails;
  public order: Order;
  public cartItem: CartItem;
  public cartItems: Array<CartItem>;
  public subTotal: number;
  public tax: number;
  public shipping: number;
  public orderTotal: number;



  constructor(private authenticationService: AuthenticationService,
    private userService: UserService, private foodListService: FoodListService,
    private router: Router, config: NgbModalConfig, private alertService: AlertService,
    private modalService: NgbModal, private orderService: OrderService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.foodDetails = [];
    this.filterByRestaurantNameOrDishName = "";
    config.backdrop = 'static';
    config.keyboard = false;
    this.addToCartTemplateType = false;
    this.food = {} as IFoodDetails;
    this.order = {} as Order;
    this.cartItem = {} as CartItem;
    this.cartItems = [];
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;

    })
    this.subTotal = 0;
    this.tax = 5;
    this.shipping = 10;
    this.orderTotal = 0
  }

  ngOnInit() {
    this.intializeFoodMenu();
  }
  public intializeFoodMenu(): void {
    this.foodListService.getFood().subscribe((response: IFoodDetails[]) => {
      this.foodDetails = response;
    })
  }

  open(cardtemplate: any, food: IFoodDetails, templatetype: String) {
    this.food = food;
    if (templatetype == "addToCart")
      this.addToCartTemplateType = true;
    if (templatetype == "placeOrder")
      this.addToCartTemplateType = false;
    this.modalService.open(cardtemplate);
  }




  confirmAddToCart(food: IFoodDetails) {
    if (this.currentUser.id) {
      this.orderService.checkIfItAlreadyExistsInCart(this.currentUser.id, food.dishName).pipe(first())
        .subscribe(
          response => {
            if (response.length != 0) {
              this.cartItem.qty = response[0].qty + 1;
              this.cartItem.itemPrice = (response[0].basePrice) * (this.cartItem.qty);
              this.orderService.updateCart(response[0].id, this.cartItem.qty, this.cartItem.itemPrice)
                .pipe(first())
                .subscribe(
                  response => {
                    if (response != null) {
                      this.router.navigate(['/cart'])
                      this.alertService.success("Items added to cart successfully")
                      this.modalService.dismissAll();
                    }
                    else
                      this.alertService.error("Items not added to cart due to unexpected error")
                  },
                  error => {
                    this.alertService.error("Items not added to cart due to unexpected error")
                  })
            }
            else {
              this.cartItem.itemImage = food.imageUrl ? food.imageUrl : 'Image';
              this.cartItem.basePrice = food.cost ? food.cost : 0;
              this.cartItem.qty = 1;
              this.cartItem.itemPrice = (this.cartItem.basePrice) * (this.cartItem.qty);
              this.cartItem.userId = this.currentUser.id ? this.currentUser.id : 0;

              this.cartItem.dishName = food.dishName;

              this.orderService.addToCart(this.cartItem).pipe(first())
                .subscribe(
                  response => {
                    if (response != null) {

                      this.router.navigate(['/cart'])
                      this.alertService.success("Items added to cart successfully")
                      this.modalService.dismissAll()

                    }
                    else {
                      this.alertService.error("Items not added to cart due to unexpected error")

                    }
                  },
                  error => {
                    this.alertService.error("Items not added to cart due to unexpected error")
                  })
            }
          },
          error => {
          })
    }
    else

      this.alertService.error("Your session has expired, please login again to continue")
  }

  placeOrder(food: IFoodDetails) {
    this.fetchItemsFromCart()

    if (this.currentUser.id && food.id) {
      this.order.userId = this.currentUser.id;
      this.order.feedId = uuidv4();
      this.order.orderstatus = 'process';
      this.order.paymentStatus = 'not paid';
      if (this.orderTotal == 0 && food.cost) { this.orderTotal = food.cost + this.tax + this.shipping; }
      this.order.totalAmount = this.orderTotal
      this.orderService.currentOrderSubject.next(this.order)
      this.router.navigate(['/placeOrder/bank'])
      this.modalService.dismissAll()

    }

  }

  fetchItemsFromCart() {
    if (this.currentUser.id) {
      this.orderService.getCartItems(this.currentUser.id).pipe(first())
        .subscribe(
          items => {
            if (items.length != 0) {
              this.cartItems = items;
              for (let i = 0; i < this.cartItems.length; i++) {
                this.subTotal = this.subTotal + this.cartItems[i].itemPrice
              }
              this.tax = 10;
              this.shipping = 5

              this.orderTotal = this.subTotal + this.tax + this.shipping;

            }
            else
              this.orderTotal = 0;

          },
          error => {
            this.alertService.error("Cart Details are not shown due to unexpected error")
          })
    }
    else
      this.alertService.error("Your Session has expired, please login to continue")

  }

}


