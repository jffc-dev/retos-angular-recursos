import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart.service';
import { Producto } from '../producto.model';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-producto-catalogo',
  imports: [RouterLink],
  templateUrl: './producto-catalogo.html',
})
export class ProductoCatalogo {
  private readonly productoService = inject(ProductoService);
  protected readonly cart = inject(CartService);

  protected readonly productos = signal<Producto[]>([]);
  private readonly cantidades = signal<Record<string, number>>({});

  constructor() {
    this.productoService.listar().subscribe((productos) => {
      this.productos.set(productos);
      this.cantidades.set(Object.fromEntries(productos.map((p) => [p.id, 1])));
    });
  }

  cantidadDe(productoId: string): number {
    return this.cantidades()[productoId] ?? 1;
  }

  actualizarCantidad(productoId: string, valor: string): void {
    const cantidad = Math.max(1, Number(valor) || 1);
    this.cantidades.update((actual) => ({ ...actual, [productoId]: cantidad }));
  }

  agregar(producto: Producto): void {
    this.cart.add(producto, this.cantidadDe(producto.id));
  }
}
