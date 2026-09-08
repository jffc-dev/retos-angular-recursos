import { Component, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../categories/category.service';

@Component({
  imports: [],
  selector: 'app-product-filter',
  styleUrl: './product-filter.css',
  templateUrl: './product-filter.html',
  host: { class: 'block' },
})
export class ProductFilter {
  private readonly categoryService = inject(CategoryService)
  value = input('');
  searchChange = output<string>();
  categoryChange = output<string>();
  categories = toSignal(this.categoryService.findAll(), {initialValue: []})
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
