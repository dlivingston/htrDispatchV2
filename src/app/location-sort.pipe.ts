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
      let returnArray = tickets.sort(compare);
      if ((sortDirection == true && returnArray[0].client_loc_id < returnArray[returnArray.length - 1].client_loc_id) || (sortDirection == false && returnArray[0].client_loc_id > returnArray[returnArray.length - 1].client_loc_id)) {
        return returnArray;
      } else {
        return returnArray.reverse();
      }
    }
  }

}
