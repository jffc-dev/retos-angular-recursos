import { Injectable, computed, effect, signal } from '@angular/core';
import { Producto } from './producto.model';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly localStorageKey = 'carrito'
  private readonly _items = signal<CartItem[]>(this.readStorage());

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((total, item) => total + item.cantidad, 0));
  readonly total = computed(() =>
    this._items().reduce((total, item) => total + item.producto.precio * item.cantidad, 0),
  );

  readStorage(): CartItem[]{
    const data = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]')
    return data
  }

  constructor(){
    effect(() => {
      const stringData = JSON.stringify(this._items())
      localStorage.setItem(this.localStorageKey, stringData)
    })
  }

  add(producto: Producto, cantidad: number): void {
    this._items.update((items) => {
      const existente = items.find((item) => item.producto.id === producto.id);
      if (existente) {
        return items.map((item) =>
          item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item,
        );
      }
      return [...items, { producto, cantidad }];
    });
  }

  remove(productoId: string): void {
    this._items.update((items) => items.filter((item) => item.producto.id !== productoId));
  }

  updateCantidad(productoId: string, cantidad: number): void {
    this._items.update((items) =>
      items.map((item) => (item.producto.id === productoId ? { ...item, cantidad } : item)),
    );
  }

  clear(): void {
    this._items.set([]);
  }
}
