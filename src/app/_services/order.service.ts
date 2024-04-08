import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CartItem } from '../_models/cartItem.model';
import { Order } from '../_models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public currentOrderSubject: BehaviorSubject<Order>;
  public currentOrder: Observable<Order>;
  public order: {
    "userId": number,
    "feedId": string;
    "orderstatus": string,
    "paymentStatus": string,
    "orderDate": Date,
    "orderTime": number,
    "totalAmount": number
  };


  constructor(private http: HttpClient) {
    this.order = {
      "userId": 0,
      "feedId": '',
      "orderstatus": '',
      "paymentStatus": '',
      "orderDate": new Date(),
      "orderTime": new Date().getTime(),
      "totalAmount": 0
    }

    this.currentOrderSubject = new BehaviorSubject<Order>(this.order);
    this.currentOrder = this.currentOrderSubject.asObservable();
  }

  placeOrder(order: Order) {
    return this.http.post(`${environment.apiUrl}/orders`, order);
  }
  addToCart(cartItem: CartItem) {
    return this.http.post(`${environment.apiUrl}/cart`, cartItem);
  }

  getCartItems(userId: number) {
    return this.http.get<CartItem[]>(`${environment.apiUrl}/cart?userId=${userId}`);
  }

  updateCart(id: number, qty: number, itemPrice: number) {
    return this.http.patch<CartItem>(`${environment.apiUrl}/cart/${id}`, { "qty": qty, "itemPrice": itemPrice });
  }

  deleteFromCart(id: number) {
    return this.http.delete<CartItem>(`${environment.apiUrl}/cart/${id}`);

  }

  checkIfItAlreadyExistsInCart(userId: number, dishName: string) {
    return this.http.get<CartItem[]>(`${environment.apiUrl}/cart?userId=${userId}&dishName=${dishName}`)
  }

  getOrderByFeedId(feedId: string) {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders?feedId=${feedId}`);
  }
  getOrderByUserId(userId: number) {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders?userId=${userId}`);
  }

}
