import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { ProductoService } from '../producto.service';

/** Simula la consulta de stock disponible para una línea del carrito. */
export function stockAsyncValidator(productoService: ProductoService, productoId: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const cantidad = Number(control.value);
    if (!Number.isFinite(cantidad) || cantidad < 1) {
      return of(null);
    }

    return productoService.consultarStock(productoId, cantidad).pipe(
      map((haySuficienteStock) =>
        haySuficienteStock
          ? null
          : { stockInsuficiente: { disponible: productoService.obtenerStock(productoId), solicitado: cantidad } },
      ),
    );
  };
}
