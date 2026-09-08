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

const ELEMENTOS_POR_PAGINA = 20

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  search(query: string, category: string, pagina: number): Observable<Product[]> {
    const desde = (pagina - 1) * ELEMENTOS_POR_PAGINA
    const hasta = desde + ELEMENTOS_POR_PAGINA - 1

    return this.http.get<ApiProduct[]>(`${SUPABASE_REST_URL}/catalog_variants`, {
      params: (query || category) ? {
        product_name: `ilike.*${query}*`,
        category_names: `cs.{${category}}`
      } : {},
      headers: {
        ...SUPABASE_HEADERS,
        Range: `${desde}-${hasta}`
      }
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
