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
      let returnArray = tickets.sort(compare);

      if ((sortDirection == true && returnArray[0].client_name < returnArray[returnArray.length - 1].client_name) || (sortDirection == false && returnArray[0].client_name > returnArray[returnArray.length - 1].client_name)) {
        return returnArray;
      } else {
        return returnArray.reverse();
      }
    }
  }

}
