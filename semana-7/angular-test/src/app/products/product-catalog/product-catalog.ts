import { Component, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { ProductFilter } from '../product-filter/product-filter';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { concatMap, debounceTime, distinctUntilChanged, exhaustMap, mergeMap, of, retry, switchMap, timer } from 'rxjs';
import { config } from '../../app.config.server';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [ProductCard, ProductFilter],
  selector: 'app-product-catalog',
  styleUrl: './product-catalog.css',
  templateUrl: './product-catalog.html',
  host: { class: 'block' },
})
export class ProductCatalog {
  private readonly productService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  protected readonly searchTerm = signal('');
  protected readonly loading = signal(false);

  constructor(){
    const queryParamMap = this.activatedRoute.snapshot.queryParamMap
    this.searchTerm.set(queryParamMap.get('search') ?? '')

    effect(()=>{
      this.router.navigate([], {
        queryParams: { search: this.searchTerm()}
      })
    })
  }

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

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
