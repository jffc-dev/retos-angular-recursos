import { Service, computed, signal } from '@angular/core';

@Service()
export class ContadorService {
  private readonly valor = signal(0);

  public readonly contador = this.valor.asReadonly();
  public readonly esPar = computed(() => this.valor() % 2 === 0);
  public readonly esNegativo = computed(() => this.valor() < 0);

  public incrementar(paso = 1): void {
    this.valor.update((v) => v + paso);
  }

  public decrementar(paso = 1): void {
    this.valor.update((v) => v - paso);
  }

  public reiniciar(): void {
    this.valor.set(0);
  }
}
