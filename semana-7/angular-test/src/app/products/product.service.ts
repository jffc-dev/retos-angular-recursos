import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from './product.model';
import { SUPABASE_HEADERS, SUPABASE_REST_URL } from '../config/supabase.config';

interface ApiProduct {
  price: number,
  product_id: string,
  product_name: string,
  image_url: string
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  search(query: string, category: string): Observable<Product[]> {
    return this.http.get<ApiProduct[]>(`${SUPABASE_REST_URL}/catalog_variants`, {
      params: (query || category) ? { product_name: `ilike.*${query}*` } : {},
      headers: SUPABASE_HEADERS
    }).pipe(
      map((response: ApiProduct[]) => {
        return response.map((product) => this.toProduct(product))
      })
    );
  }

  private toProduct(row: ApiProduct): Product{
    return {
      id: row.product_id,
      name: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
    }
  }
}
