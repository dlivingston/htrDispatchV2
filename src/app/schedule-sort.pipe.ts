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
      let returnArray = tickets.sort(compare);
      if ((sortDirection == true && returnArray[0].sched_srvc_date < returnArray[returnArray.length - 1].sched_srvc_date) || (sortDirection == false && returnArray[0].sched_srvc_date > returnArray[returnArray.length - 1].sched_srvc_date)) {
        return returnArray;
      } else {
        return returnArray.reverse();
      }
    }
  }

}
