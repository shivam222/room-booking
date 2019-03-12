import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BasicApisService } from '../services/basic-apis.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })

export class EmailValid {
    constructor(private emailApi: BasicApisService) {}
    emailValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
          return this.emailApi.doesEmailExists(control.value)
            .pipe(
              map(res => {
                if (res === 'true') {
                  return { 'emailTaken': true};
                } else {
                    return null;
                }
              })
            );
        };
      }
}
