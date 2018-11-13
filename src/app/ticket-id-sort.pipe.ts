import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ticketIdSort'
})
export class TicketIdSortPipe implements PipeTransform {

  transform(tickets: any[], sortDirection: any): any {
    function compare(a, b){
      let comparison = 0;
      if (a.id > b.id) {
        comparison = 1;
      } else if (a.id < b.id) {
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
