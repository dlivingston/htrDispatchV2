import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elapsedTime'
})
export class ElapsedTimePipe implements PipeTransform {

  transform(value: any, args: any): any {
    if(args === 'min'){
      let minutes = Math.floor(value / 1000 / 60 % 60);
      return minutes;
    }
    if(args === 'hrs'){
      let hours = Math.floor(value/ 1000 / 3600 % 24);
      return hours;
    }
    return value;
  }

}
