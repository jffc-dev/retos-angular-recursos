import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable, map } from "rxjs";
import { SUPABASE_REST_URL, SUPABASE_HEADERS } from "../config/supabase.config";
import { Product } from "../products/product.model";

interface ApiCategory {
  name: string
}

@Service()
export class CategoryService {
  private readonly http = inject(HttpClient);

  findAll(): Observable<string[]> {
    return this.http.get<ApiCategory[]>(`${SUPABASE_REST_URL}/category`, {
      headers: SUPABASE_HEADERS
    }).pipe(
      map((response: ApiCategory[]) => {
        return response.map((category) => category.name)
      })
    );
  }
}
