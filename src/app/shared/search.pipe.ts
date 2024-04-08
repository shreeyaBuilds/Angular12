import { Pipe, PipeTransform } from '@angular/core';
import { IFoodDetails } from '../_models/food.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: IFoodDetails[], searchedDishNameOrRestaurantName: string): IFoodDetails[] {
    if (value.length === 0 || searchedDishNameOrRestaurantName === '') {
      return value;
    }
    const result = [];
    for (const item of value) {
      if (item.restaurant.toLocaleLowerCase().match(searchedDishNameOrRestaurantName.toLocaleLowerCase()) ||
        item.dishName.toLocaleLowerCase().match(searchedDishNameOrRestaurantName.toLocaleLowerCase())) {
        result.push(item)
      }

    }
    return result;
  }
}