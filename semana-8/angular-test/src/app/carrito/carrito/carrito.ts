import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink],
  templateUrl: './carrito.html',
})
export class Carrito {
  protected readonly cart = inject(CartService);

  incrementar(productoId: string, cantidadActual: number, stock: number): void {
    if (cantidadActual < stock) {
      this.cart.updateCantidad(productoId, cantidadActual + 1);
    }
  }

  decrementar(productoId: string, cantidadActual: number): void {
    if (cantidadActual > 1) {
      this.cart.updateCantidad(productoId, cantidadActual - 1);
    }
  }
}
