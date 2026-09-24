import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

@Service()
export class RecaptchaService {

  private http = inject(HttpClient)

  verify(token: string){
    console.log(token)

    return this.http.post(`${environment.supabaseUrl}/functions/v1/captcha`, {token},
      {headers: {apikey: environment.supabasePublishableKey}}
    )
  }
}
