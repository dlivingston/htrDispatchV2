import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ticketIdSort'
})
export class TicketIdSortPipe implements PipeTransform {

  transform(tickets: any[], sortDirection: any): any {
    if (tickets) {
      if ((sortDirection == true && (tickets[0].id < tickets[tickets.length - 1].id)) || (sortDirection == false && (tickets[0].id > tickets[tickets.length - 1].id))) {
        return tickets;
      } else {
        return tickets.reverse();
      }
    }

  }

}
