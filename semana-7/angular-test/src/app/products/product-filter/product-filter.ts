import { Component, input, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-product-filter',
  styleUrl: './product-filter.css',
  templateUrl: './product-filter.html',
  host: { class: 'block' },
})
export class ProductFilter {
  value = input('');
  searchChange = output<string>();
  categoryChange = output<string>();
  categories = signal<string[]>([
    'Zapatos',
    'Zapatillas',
    'Polos',
    'Poleras'
  ])
  category = signal<string>('')

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value.trim());
  }

  onCategoryClick(selectedCategory: string){
    this.category.set(selectedCategory)
    this.categoryChange.emit(selectedCategory);
  }
}
