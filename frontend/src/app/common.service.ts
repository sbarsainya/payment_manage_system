import { Injectable } from '@angular/core';
import {AbstractControl, ValidationErrors} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  downloadFile(blob: any, filename: string, mimeType: string) {
    const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const date = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today ? null : { futureDate: true };
  }
}


