import { Component, effect, inject, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { ProductFilter } from '../product-filter/product-filter';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  imports: [ProductCard, ProductFilter],
  selector: 'app-product-catalog',
  styleUrl: './product-catalog.css',
  templateUrl: './product-catalog.html',
  host: { class: 'block' },
})
export class ProductCatalog {
  private readonly productService = inject(ProductService);

  protected readonly searchTerm = signal('');
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(false);

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.productService.search(this.searchTerm()).subscribe((r) => {
        this.products.set(r);
        this.loading.set(false);
      });
    });
  }

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
