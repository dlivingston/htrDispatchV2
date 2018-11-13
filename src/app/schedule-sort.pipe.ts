import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheduleSort'
})
export class ScheduleSortPipe implements PipeTransform {

  transform(tickets: any[], sortDirection: any): any {
    function compare(a, b) {
      const valA = a.sched_srvc_date;
      const valB = b.sched_srvc_date;

      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
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
