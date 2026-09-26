import { Component, inject } from '@angular/core';
import { ContadorService } from '../../servicios/contador';

@Component({
  selector: 'app-contador',
  templateUrl: './contador.html',
})
export default class Contador {
  protected readonly contadorService = inject(ContadorService);
}
