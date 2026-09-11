import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-product-pagination',
  templateUrl: './product-pagination.html',
  host: { class: 'block' },
})
export class ProductPagination {
  pagina = input.required<number>()
  listaPaginas = input.required<number[]>()
  totalPaginas = input.required<number>()
}
