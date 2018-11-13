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
      if (sortDirection == true) {
        return tickets.sort(compare);
      } else {
        return tickets.sort(compare).reverse();
      }
    }
  }
}
