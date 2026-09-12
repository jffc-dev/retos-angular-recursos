import { Component, computed, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-product-pagination',
  templateUrl: './product-pagination.html',
  host: { class: 'block' },
})
export class ProductPagination {
  pagina = input.required<number>()
  totalPaginas = input.required<number>()
  cambioPagina = output<number>()

  listaPaginas = computed(() => Array.from({length: this.totalPaginas()}, (_, y) => y+1))

  irAnterior(){
    this.irPagina(this.pagina() - 1)
  }

  irSiguiente(){
    this.irPagina(this.pagina() + 1)
  }

  irPagina(pagina: number){
    this.cambioPagina.emit(pagina)
  }
}
