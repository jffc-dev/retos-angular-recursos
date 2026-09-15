import { Injectable, signal } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { Producto } from './producto.model';

const PRODUCTOS_INICIALES: Producto[] = [
  {
    id: 'p1',
    nombre: 'Teclado mecánico 60%',
    precio: 189.9,
    stock: 8,
    imagenUrl: 'https://picsum.photos/seed/teclado/400/300',
  },
  {
    id: 'p2',
    nombre: 'Mouse inalámbrico',
    precio: 79.5,
    stock: 3,
    imagenUrl: 'https://picsum.photos/seed/mouse/400/300',
  },
  {
    id: 'p3',
    nombre: 'Monitor 27" 144Hz',
    precio: 899.0,
    stock: 1,
    imagenUrl: 'https://picsum.photos/seed/monitor/400/300',
  },
  {
    id: 'p4',
    nombre: 'Webcam 1080p',
    precio: 129.0,
    stock: 0,
    imagenUrl: 'https://picsum.photos/seed/webcam/400/300',
  },
  {
    id: 'p5',
    nombre: 'Audífonos Bluetooth',
    precio: 149.9,
    stock: 5,
    imagenUrl: 'https://picsum.photos/seed/audifonos/400/300',
  },
  {
    id: 'p6',
    nombre: 'Silla ergonómica',
    precio: 649.0,
    stock: 2,
    imagenUrl: 'https://picsum.photos/seed/silla/400/300',
  },
];

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly productos = signal<Producto[]>(PRODUCTOS_INICIALES);

  listar(): Observable<Producto[]> {
    return of(this.productos()).pipe(delay(300));
  }

  obtenerStock(productoId: string): number {
    return this.productos().find((p) => p.id === productoId)?.stock ?? 0;
  }

  /** Simula una consulta de stock contra un backend. */
  consultarStock(productoId: string, cantidadSolicitada: number): Observable<boolean> {
    return of(this.obtenerStock(productoId)).pipe(
      delay(600),
      map((disponible) => cantidadSolicitada <= disponible),
    );
  }

  reducirStock(productoId: string, cantidad: number): void {
    this.productos.update((lista) =>
      lista.map((p) => (p.id === productoId ? { ...p, stock: Math.max(0, p.stock - cantidad) } : p)),
    );
  }
}
