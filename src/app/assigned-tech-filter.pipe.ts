import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assignedTechFilter',
  //pure: false
})
export class AssignedTechFilterPipe implements PipeTransform {

  transform(tickets: any[], techs: any[]): any {
    if (techs[0] === 'All' || !tickets) {
      return tickets;
    } else {
      var returnArray = [];
      for (var i = 0; i < tickets.length; i++) {
        for (var j = 0; j < techs.length; j++) {
          if (tickets[i].assigned_tech_name === techs[j]) {
            returnArray.push(tickets[i]);
          }
        }
      }
      return returnArray;
    }
  }
}
