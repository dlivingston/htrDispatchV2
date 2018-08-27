import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'techSort'
})
export class TechSortPipe implements PipeTransform {

  transform(tickets: any[], sortDirection: any): any {
    function compare(a, b) {
      const techA = a.assigned_tech_name.toLowerCase();
      const techB = b.assigned_tech_name.toLowerCase();

      let comparison = 0;
      if (techA > techB) {
        comparison = 1;
      } else if (techA < techB) {
        comparison = -1;
      }
      return comparison;
    }
    if (tickets) {
      let returnArray = tickets.sort(compare);
      if ((sortDirection == true && returnArray[0].assigned_tech_name < returnArray[returnArray.length - 1].assigned_tech_name) || (sortDirection == false && returnArray[0].assigned_tech_name > returnArray[returnArray.length - 1].assigned_tech_name)) {
        return returnArray;
      } else {
        return returnArray.reverse();
      }
    }
  }
}
