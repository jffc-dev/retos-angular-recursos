import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-tecla',
  templateUrl: './tecla.html',
  host: {
    '[class.col-span-2]': 'esDoble()',
  },
})
export class Tecla {
  public estaPresionada = signal(false);

  public presionar = output<string>();
  public contenido = viewChild<ElementRef<HTMLButtonElement>>('boton');

  public esOperador = input(false, {
    transform: (valor: boolean | string) => (typeof valor === 'string' ? valor === '' : valor),
  });

  public esFuncion = input(false, {
    transform: (valor: boolean | string) => (typeof valor === 'string' ? valor === '' : valor),
  });

  public esDoble = input(false, {
    transform: (valor: boolean | string) => (typeof valor === 'string' ? valor === '' : valor),
  });

  manejarClick() {
    if (!this.contenido()?.nativeElement) {
      return;
    }

    const valor = this.contenido()!.nativeElement.innerText;

    this.presionar.emit(valor.trim());
  }

  public estiloPresionadoTeclado(tecla: string) {
    if (!this.contenido()) return;

    const valor = this.contenido()!.nativeElement.innerText;

    if (valor !== tecla) return;

    this.estaPresionada.set(true);

    setTimeout(() => {
      this.estaPresionada.set(false);
    }, 100);
  }
}
