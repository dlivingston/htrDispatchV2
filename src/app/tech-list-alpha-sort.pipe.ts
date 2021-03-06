import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'techListAlphaSort'
})
export class TechListAlphaSortPipe implements PipeTransform {

  transform(techs: any[], args: any): any {
    function compare(a, b) {
      const techA = a.payload.val().name.toLowerCase();
      const techB = b.payload.val().name.toLowerCase();

      let comparison = 0;
      if (techA > techB) {
        comparison = 1;
      } else if (techA < techB) {
        comparison = -1;
      }
      return comparison;
    }
    if (techs) {
      let returnArray = techs.sort(compare);
      let unassignedIndex = returnArray.map(tech => tech.payload.val().name).indexOf('Unassigned');
      returnArray.push(returnArray.splice(unassignedIndex, 1)[0]);
      return returnArray;
    }
  }
}
