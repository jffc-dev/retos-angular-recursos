import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { ProductoService } from '../producto.service';

/** Simula la consulta de stock disponible para una línea del carrito. */
export function stockAsyncValidator(productoService: ProductoService, productoId: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // TODO: implementar el AsyncValidatorFn de stock.
    // 1. Lee la cantidad solicitada desde control.value (conviértela a número).
    //    Si no es un número válido o es menor a 1, no valides todavía -> devuelve of(null).
    // 2. Llama a productoService.consultarStock(productoId, cantidad), que devuelve
    //    un Observable<boolean> (true = hay stock suficiente).
    // 3. Con `map`, transforma esa respuesta:
    //    - true  -> null (sin error)
    //    - false -> { stockInsuficiente: { disponible, solicitado } }
    //      (usa productoService.obtenerStock(productoId) para "disponible")
    return of(null);
  };
}
