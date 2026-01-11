// truncate-url.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateUrl',
  standalone: true
})
export class TruncateUrlPipe implements PipeTransform {
  transform(value: string, maxLength: number = 60): string {
    if (!value) return '';
    
    if (value.length <= maxLength) return value;
    
    // Mantener el inicio y el final de la URL
    const start = value.substring(0, Math.floor(maxLength / 2));
    const end = value.substring(value.length - Math.floor(maxLength / 4));
    
    return start + '...' + end;
  }
}