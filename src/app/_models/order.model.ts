export interface Order{
        id?: number,
        userId: number,
        feedId: string,
        orderstatus?: string,
        paymentStatus?: string,
        orderDate?: Date,   
        orderTime?: number,
        totalAmount : number,   
  }