import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/_models/order.model';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {

  public active: string;
  public order = {} as Order;
  constructor(private orderService: OrderService) {
    this.active = 'bank';

    this.orderService.currentOrder.subscribe(x => {
      this.order = x;

    });
  }

  ngOnInit(): void {
  }



}
