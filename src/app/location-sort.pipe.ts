import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'locationSort'
})
export class LocationSortPipe implements PipeTransform {

  transform(tickets: any[], sortDirection: any): any {
    function compare(a, b) {
      const locA = a.client_loc_id.toLowerCase();
      const locB = b.client_loc_id.toLowerCase();

      let comparison = 0;
      if (locA > locB) {
        comparison = 1;
      } else if (locA < locB) {
        comparison = -1;
      }
      return comparison;
    }
    if (tickets) {
      if (sortDirection == true) {
        return tickets.sort(compare);
      } else {
        return tickets.sort(compare).reverse();
      }
    }
  }

}
