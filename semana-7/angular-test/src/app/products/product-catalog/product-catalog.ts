import { Component, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { ProductFilter } from '../product-filter/product-filter';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { concatMap, debounceTime, distinctUntilChanged, exhaustMap, mergeMap, of, retry, switchMap, timer } from 'rxjs';

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
  protected readonly loading = signal(false);

  protected readonly products: Signal<Product[]> = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(500),
      distinctUntilChanged((anterior, actual)=>{
        return anterior.toLowerCase() === actual.toLowerCase()
      }),
      switchMap((term) => {
        return this.productService.search(term).pipe(
          retry({
            count: 2,
            delay: () => {
              return timer(5000)
            }
          })
        )
      })
    ),
    {initialValue: []}
  )

  constructor() {
    // effect(() => {
    //   this.loading.set(true);
    //   this.productService.search(this.searchTerm()).subscribe((r) => {
    //     this.products.set(r);
    //     this.loading.set(false);
    //   });
    // });
  }

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
