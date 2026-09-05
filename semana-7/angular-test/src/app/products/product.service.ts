import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product.model';

// TODO: reemplazar por la URL real del endpoint de catálogo cuando esté disponible.
const PRODUCTS_API_URL = 'http://localhost:3000/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  search(query: string, category: string): Observable<Product[]> {
    return this.http.get<Product[]>(PRODUCTS_API_URL, {
      params: (query || category) ? { search: query, category: category } : {},
    });
  }
}
