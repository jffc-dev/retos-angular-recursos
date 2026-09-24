import { Injectable, signal } from '@angular/core';

const numeros = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operadores = ['+', '-', '*', '×', '/', '÷'];
const operadoresEspeciales = ['+/-', '%', '.', '=', 'C', 'Backspace'];

@Injectable({
  providedIn: 'root',
})
export class MotorCalculadora {
  public pantalla = signal('0');
  public memoria = signal('0');
  public operador = signal('+');

  public procesarTecla(valor: string): void {
    // Validar entrada
    if (![...numeros, ...operadores, ...operadoresEspeciales].includes(valor)) {
      console.log('Entrada inválida', valor);
      return;
    }

    // =
    if (valor === '=') {
      this.calcularResultado();
      return;
    }

    // Limpiar
    if (valor === 'C') {
      this.pantalla.set('0');
      this.memoria.set('0');
      this.operador.set('+');
      return;
    }

    // Borrar último
    if (valor === 'Backspace') {
      if (this.pantalla() === '0') return;
      if (this.pantalla().includes('-') && this.pantalla().length === 2) {
        this.pantalla.set('0');
        return;
      }

      if (this.pantalla().length === 1) {
        this.pantalla.set('0');
        return;
      }

      this.pantalla.update((v) => v.slice(0, -1));
      return;
    }

    // Aplicar operador
    if (operadores.includes(valor)) {
      this.operador.set(valor);
      this.memoria.set(this.pantalla());
      this.pantalla.set('0');
      return;
    }

    // Limitar número de caracteres
    if (this.pantalla().length >= 10) {
      console.log('Máximo de caracteres alcanzado');
      return;
    }

    // Punto decimal
    if (valor === '.' && !this.pantalla().includes('.')) {
      if (this.pantalla() === '0' || this.pantalla() === '') {
        this.pantalla.set('0.');
        return;
      }
      this.pantalla.update((texto) => texto + '.');
      return;
    }

    // Cero inicial
    if (valor === '0' && (this.pantalla() === '0' || this.pantalla() === '-0')) {
      return;
    }

    // Cambiar signo
    if (valor === '+/-') {
      if (this.pantalla().includes('-')) {
        this.pantalla.update((texto) => texto.slice(1));
        return;
      }

      this.pantalla.update((texto) => '-' + texto);
      return;
    }

    // Números
    if (numeros.includes(valor)) {
      if (this.pantalla() === '0') {
        this.pantalla.set(valor);
        return;
      }

      if (this.pantalla() === '-0') {
        this.pantalla.set('-' + valor);
        return;
      }

      this.pantalla.update((texto) => texto + valor);
      return;
    }
  }

  public calcularResultado() {
    const numero1 = parseFloat(this.memoria());
    const numero2 = parseFloat(this.pantalla());

    let resultado = 0;

    switch (this.operador()) {
      case '+':
        resultado = numero1 + numero2;
        break;
      case '-':
        resultado = numero1 - numero2;
        break;
      case '*':
      case '×':
        resultado = numero1 * numero2;
        break;
      case '/':
      case '÷':
        resultado = numero1 / numero2;
        break;
    }

    this.pantalla.set(resultado.toString());
    this.memoria.set('0');
  }
}
