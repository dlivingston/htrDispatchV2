import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listSearch'
})
export class ListSearchPipe implements PipeTransform {

  transform(tickets: any[], searchText: string): any {
    if (!tickets || !searchText) {
      return tickets;
    } else {
      var returnArray = [];
      for (var i = 0; i < tickets.length; i++) {
        var search = searchText.toLowerCase();
        if (tickets[i].id.includes(search) || (tickets[i].client_name.toLowerCase().indexOf(search) !== -1)) {
          returnArray.push(tickets[i]);
        }
      }
      return returnArray;
    }

  }
}
