import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { of } from 'rxjs';

@Service()
export class RecaptchaService {

  private http = inject(HttpClient)

  verify(token: string){
    console.log(token)
    // todo: peticion http a nuestro supabase function
    return of(true)
  }
}
