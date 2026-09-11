import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from './product.model';
import { SUPABASE_HEADERS, SUPABASE_REST_URL } from '../config/supabase.config';
import { SearchResponse } from '../core/search-product.interface';

interface ApiProduct {
  price: number,
  product_id: string,
  product_name: string,
  image_url: string,
  variant_id: string,
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  search(query: string, category: string, pagina: number, size: number): Observable<SearchResponse> {
    const desde = (pagina - 1) * size
    const hasta = desde + size - 1

    return this.http.get<ApiProduct[]>(`${SUPABASE_REST_URL}/catalog_variants`, {
      params: (query || category) ? {
        product_name: `ilike.*${query}*`,
        category_names: `cs.{${category}}`
      } : {},
      headers: {
        ...SUPABASE_HEADERS,
        Range: `${desde}-${hasta}`,
        Prefer: 'count=exact',
      },
      observe: 'response'
    }).pipe(
      map((response) => {
        const count = Number(response.headers.get('content-range')?.split('/')[1])
        return {
          data: response.body!.map((product) => this.toProduct(product)),
          count
        }
      })
    );
  }

  private toProduct(row: ApiProduct): Product{
    return {
      id: row.variant_id,
      name: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
    }
  }
}
