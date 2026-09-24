import { Injectable, signal } from '@angular/core';

const DIGITOS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const OPERADORES = ['+', '-', '×', '÷'];
const ESPECIALES = ['+/-', '%', '.', '=', 'C', 'Backspace'];
const LARGO_MAXIMO = 10;
const TEXTO_ERROR = 'Error';

export const esTeclaValida = (tecla: string): boolean =>
  [...DIGITOS, ...OPERADORES, ...ESPECIALES].includes(tecla);

@Injectable({
  providedIn: 'root',
})
export class MotorCalculadora {
  private readonly _pantalla = signal('0');
  private readonly _memoria = signal('0');
  private readonly _operador = signal('+');

  public readonly pantalla = this._pantalla.asReadonly();
  public readonly memoria = this._memoria.asReadonly();
  public readonly operador = this._operador.asReadonly();

  public procesarTecla(tecla: string): void {
    if (!esTeclaValida(tecla)) return;

    // Tras un error cualquier tecla empieza de cero
    if (this._pantalla() === TEXTO_ERROR) this.reiniciar();

    if (tecla === '=') {
      this.resolver();
      return;
    }

    if (tecla === 'C') {
      this.reiniciar();
      return;
    }

    if (tecla === 'Backspace') {
      this.borrarUltimo();
      return;
    }

    if (OPERADORES.includes(tecla)) {
      this.aplicarOperador(tecla);
      return;
    }

    if (tecla === '+/-') {
      this._pantalla.update((texto) => (texto.startsWith('-') ? texto.slice(1) : '-' + texto));
      return;
    }

    if (tecla === '%') {
      this._pantalla.set(this.formatear(parseFloat(this._pantalla()) / 100));
      return;
    }

    // Limitar la cantidad de caracteres
    if (this._pantalla().replace('-', '').length >= LARGO_MAXIMO) return;

    if (tecla === '.') {
      if (!this._pantalla().includes('.')) this._pantalla.update((texto) => texto + '.');
      return;
    }

    this.agregarDigito(tecla);
  }

  public resolver(): void {
    const a = parseFloat(this._memoria());
    const b = parseFloat(this._pantalla());

    const operaciones: Record<string, (x: number, y: number) => number> = {
      '+': (x, y) => x + y,
      '-': (x, y) => x - y,
      '×': (x, y) => x * y,
      '÷': (x, y) => x / y,
    };

    const resultado = operaciones[this._operador()](a, b);

    this._pantalla.set(this.formatear(resultado));
    this._memoria.set('0');
    this._operador.set('+');
  }

  private reiniciar(): void {
    this._pantalla.set('0');
    this._memoria.set('0');
    this._operador.set('+');
  }

  private borrarUltimo(): void {
    const texto = this._pantalla();
    const esUltimoDigito = texto.length === 1 || (texto.startsWith('-') && texto.length === 2);

    this._pantalla.set(esUltimoDigito ? '0' : texto.slice(0, -1));
  }

  private aplicarOperador(operador: string): void {
    const hayOperacionPendiente = this._memoria() !== '0';

    // Si solo se cambia de operador, no se resuelve nada
    if (hayOperacionPendiente && this._pantalla() === '0') {
      this._operador.set(operador);
      return;
    }

    // Encadenar operaciones: 2 + 3 + ... muestra 5 en memoria
    if (hayOperacionPendiente) this.resolver();
    if (this._pantalla() === TEXTO_ERROR) return;

    this._operador.set(operador);
    this._memoria.set(this._pantalla());
    this._pantalla.set('0');
  }

  private agregarDigito(digito: string): void {
    const texto = this._pantalla();

    if (texto === '0') {
      this._pantalla.set(digito);
      return;
    }

    if (texto === '-0') {
      this._pantalla.set('-' + digito);
      return;
    }

    this._pantalla.set(texto + digito);
  }

  private formatear(valor: number): string {
    if (!Number.isFinite(valor)) return TEXTO_ERROR;

    // toPrecision evita resultados como 0.30000000000000004
    return Number(valor.toPrecision(LARGO_MAXIMO)).toString();
  }
}
