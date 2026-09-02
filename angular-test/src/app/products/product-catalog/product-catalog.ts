import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, of, retry, startWith, switchMap, tap, timer } from 'rxjs';
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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal(this.route.snapshot.queryParamMap.get('search') ?? '');
  protected readonly loading = signal(false);

  protected readonly products = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter((term) => term.length === 0 || term.length >= 2),
      tap((term) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: term || null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }),
      switchMap((term) => {
        this.loading.set(true);
        return this.productService.search(term).pipe(
          retry({
            count: 2,
            delay: (error) => {
              // No reintentar errores del cliente (4xx): no son transitorios.
              if (error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500) {
                throw error;
              }
              return timer(500);
            },
          }),
          // catchError(() => of<Product[]>([])),
          startWith<Product[]>([]),
          finalize(() => {
            this.loading.set(false)
          }),
        );
      }),
    ),
    { initialValue: [] },
  );

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
