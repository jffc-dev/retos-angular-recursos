import { afterNextRender, Component, ElementRef, output, signal, viewChild } from '@angular/core';
import { environment } from '../../../environments/environment';

const SCRIPT_URL = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'

interface Grecaptcha {
  render(
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ): number;
  reset(widgetId?: number): void;
}


declare global {
  interface Window {
    grecaptcha?: Grecaptcha
    onRecaptchaLoad?: () => void
  }
}

@Component({
  imports: [],
  selector: 'app-recaptcha-v2',
  styleUrl: './recaptcha-v2.css',
  templateUrl: './recaptcha-v2.html',
})
export class RecaptchaV2 {
  constructor(){
    afterNextRender(() => this.render())
  }

  container = viewChild.required<ElementRef<HTMLElement>>('container')
  error = signal(false);
  token = output<string>();

  private async render(): Promise<void>{
    const ready = new Promise<void>((resolve) => {
      if (window.grecaptcha?.render) {
        resolve();
        return;
      }
      window.onRecaptchaLoad = () => resolve();
    });

    await this.loadScript()
    await ready

    if(!window.grecaptcha) return

    window.grecaptcha.render(this.container().nativeElement, {
      sitekey: environment.recaptchaSiteKey,
      callback: (token: string) => {this.token.emit(token)},
      'expired-callback': () => {},
      'error-callback': () => {},
    })
  }

  async loadScript(){
    const pending = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('data')
        resolve()
      }
      script.onerror = () => {
        script.remove()
        reject('Hubo un error cargando el script')
      }
      document.head.appendChild(script)
    })

    return pending
  }
}
