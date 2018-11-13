import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clientSort'
})
export class ClientSortPipe implements PipeTransform {

  transform(tickets: any[], sortDirection: any): any {
    function compare(a, b) {
      const clientA = a.client_name.toLowerCase();
      const clientB = b.client_name.toLowerCase();

      let comparison = 0;
      if (clientA > clientB) {
        comparison = 1;
      } else if (clientA < clientB) {
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
