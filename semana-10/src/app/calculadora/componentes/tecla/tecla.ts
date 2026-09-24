import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

export type VarianteTecla = 'digito' | 'funcion' | 'operador';

const ESTILOS: Record<VarianteTecla, string> = {
  digito: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
  funcion: 'bg-zinc-600 text-zinc-50 hover:bg-zinc-500',
  operador: 'bg-amber-500 text-zinc-950 hover:bg-amber-400',
};

@Component({
  selector: 'app-tecla',
  templateUrl: './tecla.html',
  host: {
    class: 'block',
    '[class.col-span-2]': 'ancha()',
  },
})
export class Tecla {
  public readonly variante = input<VarianteTecla>('digito');
  public readonly ancha = input(false, { transform: booleanAttribute });

  public readonly presionada = output<string>();

  protected readonly resaltada = signal(false);
  private readonly boton = viewChild.required<ElementRef<HTMLButtonElement>>('boton');

  protected readonly clases = computed(() =>
    [ESTILOS[this.variante()], this.resaltada() ? 'scale-95 brightness-125' : ''].join(' '),
  );

  private get valor(): string {
    return this.boton().nativeElement.textContent?.trim() ?? '';
  }

  protected alPresionar(): void {
    this.presionada.emit(this.valor);
  }

  /** Resalta la tecla por un instante si coincide con la tecla física pulsada */
  public resaltarSi(tecla: string): void {
    if (this.valor !== tecla) return;

    this.resaltada.set(true);
    setTimeout(() => this.resaltada.set(false), 120);
  }
}
