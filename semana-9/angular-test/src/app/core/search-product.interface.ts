import { Product } from "../products/product.model"

export interface SearchResponse {
  data: Product[]
  count: number
}
