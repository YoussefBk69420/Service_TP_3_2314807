import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round00',
  standalone: true
})
export class Round00Pipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    return Math.round(value * 100) / 100;
  }

}
