import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BasicApisService } from '../services/basic-apis.service';
import { Observable, timer } from 'rxjs';
import { map, switchMap  } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })

export class OrgValid {
    constructor(private orgApi: BasicApisService) {}
    orgValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
          return this.orgApi.doesOrgExists(control.value)
            .pipe(
              map(res => {
                if (res === 'true') {
                  return { 'orgTaken': true};
                } else {
                    return null;
                }
              })
            );
        };
      }
}
