import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFilter',
  //pure: false
})
export class StatusFilterPipe implements PipeTransform {

  transform(tickets: any[], status: any[]): any {
    if (status[0] === 'All' || !tickets) {
      return tickets;
    } else {
      var returnArray = [];
      for (var i = 0; i < tickets.length; i++) {
        for (var j = 0; j < status.length; j++) {
          if (tickets[i].status === status[j]) {
            returnArray.push(tickets[i]);
          }
        }
      }
      return returnArray;
    }
  }
}
