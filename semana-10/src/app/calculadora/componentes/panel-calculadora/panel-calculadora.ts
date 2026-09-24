import { Component, computed, inject, viewChildren } from '@angular/core';
import { Tecla, VarianteTecla } from '../tecla/tecla';
import { esTeclaValida, MotorCalculadora } from '../../servicios/motor-calculadora';

interface DefinicionTecla {
  etiqueta: string;
  variante: VarianteTecla;
  ancha?: boolean;
}

const EQUIVALENCIAS_TECLADO: Record<string, string> = {
  Escape: 'C',
  Delete: 'C',
  '*': '×',
  x: '×',
  X: '×',
  '/': '÷',
  Enter: '=',
};

@Component({
  selector: 'app-panel-calculadora',
  imports: [Tecla],
  templateUrl: './panel-calculadora.html',
  host: {
    '(document:keydown)': 'alPulsarTeclado($event)',
  },
})
export class PanelCalculadora {
  private readonly motor = inject(MotorCalculadora);
  private readonly teclas = viewChildren(Tecla);

  protected readonly pantalla = this.motor.pantalla;
  protected readonly memoria = this.motor.memoria;
  protected readonly operador = this.motor.operador;

  protected readonly tamanoPantalla = computed(() =>
    this.pantalla().length > 8 ? 'text-4xl' : 'text-6xl',
  );

  protected readonly distribucion: DefinicionTecla[] = [
    { etiqueta: 'C', variante: 'funcion' },
    { etiqueta: '+/-', variante: 'funcion' },
    { etiqueta: '%', variante: 'funcion' },
    { etiqueta: '÷', variante: 'operador' },
    { etiqueta: '7', variante: 'digito' },
    { etiqueta: '8', variante: 'digito' },
    { etiqueta: '9', variante: 'digito' },
    { etiqueta: '×', variante: 'operador' },
    { etiqueta: '4', variante: 'digito' },
    { etiqueta: '5', variante: 'digito' },
    { etiqueta: '6', variante: 'digito' },
    { etiqueta: '-', variante: 'operador' },
    { etiqueta: '1', variante: 'digito' },
    { etiqueta: '2', variante: 'digito' },
    { etiqueta: '3', variante: 'digito' },
    { etiqueta: '+', variante: 'operador' },
    { etiqueta: '0', variante: 'digito' },
    { etiqueta: '.', variante: 'digito' },
    { etiqueta: '=', variante: 'operador', ancha: true },
  ];

  protected alPresionarTecla(tecla: string): void {
    this.motor.procesarTecla(tecla);
  }

  protected alPulsarTeclado(evento: KeyboardEvent): void {
    const tecla = EQUIVALENCIAS_TECLADO[evento.key] ?? evento.key;
    if (!esTeclaValida(tecla)) return;

    // Evita que Enter "haga click" en el botón enfocado y duplique la entrada
    evento.preventDefault();

    this.alPresionarTecla(tecla);
    this.teclas().forEach((t) => t.resaltarSi(tecla));
  }
}
