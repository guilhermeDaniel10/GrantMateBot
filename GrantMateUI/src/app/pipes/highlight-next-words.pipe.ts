import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightNextWords',
})
export class HighlightNextWordsPipe implements PipeTransform {
  transform(values: any[], args: any): any {}
}
