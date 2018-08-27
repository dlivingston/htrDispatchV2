import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityFilter',
  //pure: false
})
export class PriorityFilterPipe implements PipeTransform {

  transform(tickets: any[], priority: any[]): any {
    if (priority[0] === 'All' || !tickets) {
      return tickets;
    } else {
      var returnArray = [];
      for (var i = 0; i < tickets.length; i++) {
        for (var j = 0; j < priority.length; j++) {
          if (tickets[i].priority === priority[j]) {
            returnArray.push(tickets[i]);
          }
        }
      }
      return returnArray;
    }
  }

}
