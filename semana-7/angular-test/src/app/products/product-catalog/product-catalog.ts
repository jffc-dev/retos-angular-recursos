import { Component, computed, inject, Signal, signal, } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { ProductFilter } from '../product-filter/product-filter';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, distinctUntilChanged, finalize, retry, switchMap, tap, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResponse } from '../../core/search-product.interface';
import { ProductPagination } from '../product-pagination/product-pagination';

@Component({
  imports: [ProductCard, ProductFilter, ProductPagination],
  selector: 'app-product-catalog',
  styleUrl: './product-catalog.css',
  templateUrl: './product-catalog.html',
  host: { class: 'block' },
})
export class ProductCatalog {
  private readonly productService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)
  private ELEMENTOS_POR_PAGINA = 10

  protected readonly busqueda = signal('');
  protected readonly categoria = signal('');
  protected readonly pagina = signal(1);
  protected readonly cargando = signal(false);

  constructor(){
    const queryParamMap = this.activatedRoute.snapshot.queryParamMap
    this.busqueda.set(queryParamMap.get('search') ?? '')
    this.categoria.set(queryParamMap.get('category') ?? '')
    this.pagina.set(Number(queryParamMap.get('page')) === 0 ? 1 : Number(queryParamMap.get('page')))
    console.log(Number(queryParamMap.get('page')) ?? 1)
  }

  protected readonly resultadoBusqueda: Signal<SearchResponse> = toSignal(
    combineLatest([
      toObservable(this.busqueda),
      toObservable(this.categoria),
      toObservable(this.pagina),
    ]).pipe(
      debounceTime(500),
      distinctUntilChanged(
        ([busquedaAnterior, categoriaAnterior, paginaAnterior], [busquedaActual, categoriaActual, paginaActual])=>{
          return (
            busquedaAnterior.toLowerCase() === busquedaActual.toLowerCase() &&
            categoriaAnterior === categoriaActual &&
            paginaAnterior === paginaActual
          )
      }),
      tap(([busqueda, categoria, pagina]) => {
        console.log(pagina)
        this.cargando.set(true)
        this.router.navigate([], {
          queryParams: { search: busqueda || null, category: categoria || null, page: pagina || null}
        })
      }),
      switchMap(([busqueda, categoria, pagina]) => {
        return this.productService.search(busqueda, categoria, pagina, this.ELEMENTOS_POR_PAGINA).pipe(
          retry({
            count: 2,
            delay: () => {
              return timer(5000)
            }
          }),
          finalize(()=>{
            this.cargando.set(false)
          })
        )
      })
    ),
    {initialValue: {data: [], count: 0}}
  )

  products = computed(() => this.resultadoBusqueda().data)
  totalPaginas = computed(() => Math.ceil(this.resultadoBusqueda().count / this.ELEMENTOS_POR_PAGINA))
  listaPaginas = computed(() => Array.from({length: this.totalPaginas()}, (_, y) => y+1))

  protected onSearchChange(term: string): void {
    console.log(term)
    this.busqueda.set(term)
    this.pagina.set(1)
  }

  protected onCategoryChange(categoria: string): void {
    this.categoria.set(categoria)
    this.pagina.set(1)
  }
}
