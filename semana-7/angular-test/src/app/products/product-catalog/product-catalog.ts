import { Component, inject, Signal, signal, } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { ProductFilter } from '../product-filter/product-filter';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, distinctUntilChanged, finalize, retry, switchMap, tap, timer } from 'rxjs';
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

  protected readonly busqueda = signal('');
  protected readonly categoria = signal('');
  protected readonly loading = signal(false);

  constructor(){
    const queryParamMap = this.activatedRoute.snapshot.queryParamMap
    this.busqueda.set(queryParamMap.get('search') ?? '')
    this.categoria.set(queryParamMap.get('category') ?? '')
  }

  protected readonly products: Signal<Product[]> = toSignal(
    combineLatest([
      toObservable(this.busqueda),
      toObservable(this.categoria),
    ]).pipe(
      debounceTime(500),
      distinctUntilChanged(
        ([busquedaAnterior, categoriaAnterior], [busquedaActual, categoriaActual])=>{
          return (
            busquedaAnterior.toLowerCase() === busquedaActual.toLowerCase() &&
            categoriaAnterior === categoriaActual
          )
      }),
      tap(([busqueda, categoria]) => {
        this.loading.set(true)
        this.router.navigate([], {
          queryParams: { search: busqueda, category: categoria}
        })
      }),
      switchMap(([busqueda, categoria]) => {
        console.log(categoria)
        return this.productService.search(busqueda, categoria).pipe(
          retry({
            count: 2,
            delay: () => {
              return timer(5000)
            }
          }),
          finalize(()=>{
            this.loading.set(false)
          })
        )
      })
    ),
    {initialValue: []}
  )

  protected onSearchChange(term: string): void {
    console.log(term)
    this.busqueda.set(term);
  }

  protected onCategoryChange(categoria: string): void {
    this.categoria.set(categoria);
  }
}
