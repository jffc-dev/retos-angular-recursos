import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-product-filter',
  styleUrl: './product-filter.css',
  templateUrl: './product-filter.html',
  host: { class: 'block' },
})
export class ProductFilter {
  readonly value = input('');
  readonly searchChange = output<string>();

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value.trim());
  }
}
