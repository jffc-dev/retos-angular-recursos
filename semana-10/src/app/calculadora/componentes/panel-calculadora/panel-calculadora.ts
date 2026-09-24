import { Component, computed, inject, viewChildren } from '@angular/core';
import { Tecla } from '../tecla/tecla';
import { MotorCalculadora } from '../../servicios/motor-calculadora';

@Component({
  selector: 'app-panel-calculadora',
  imports: [Tecla],
  templateUrl: './panel-calculadora.html',
  host: {
    '(document:keyup)': 'manejarTeclado($event)',
  },
})
export class PanelCalculadora {
  private motorCalculadora = inject(MotorCalculadora);

  public teclas = viewChildren(Tecla);

  public pantalla = computed(() => this.motorCalculadora.pantalla());
  public memoria = computed(() => this.motorCalculadora.memoria());
  public operador = computed(() => this.motorCalculadora.operador());

  manejarClick(tecla: string) {
    this.motorCalculadora.procesarTecla(tecla);
  }

  manejarTeclado(evento: KeyboardEvent) {
    const equivalencias: Record<string, string> = {
      Escape: 'C',
      Clear: 'C',
      '*': '×',
      x: '×',
      X: '×',
      '/': '÷',
      Enter: '=',
    };

    const tecla = evento.key;
    const valorTecla = equivalencias[tecla] ?? tecla;

    this.manejarClick(valorTecla);

    this.teclas().forEach((boton) => {
      boton.estiloPresionadoTeclado(valorTecla);
    });
  }
}
