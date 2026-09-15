import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { DatosDni, DatosRuc, DocumentoService } from '../documento.service';

const PATRON_DNI = /^\d{8}$/;
const PATRON_RUC = /^(10|15|20)\d{9}$/;

/**
 * Valida el formato del documento leyendo el tipo desde el control hermano
 * `tipoDocumento`, por lo que debe re-evaluarse (updateValueAndValidity) cada
 * vez que ese control cambia.
 */
export function documentoFormatoValidator(tipoDocumentoCtrl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = (control.value ?? '').toString().trim();
    if (!valor) {
      return null;
    }

    const tipo = tipoDocumentoCtrl.value;
    const patron = tipo === 'RUC' ? PATRON_RUC : PATRON_DNI;
    return patron.test(valor) ? null : { formatoInvalido: { tipo } };
  };
}

/** Simula la consulta a RENIEC/SUNAT para confirmar que el documento existe. */
export function documentoExisteAsyncValidator(
  documentoService: DocumentoService,
  tipoDocumentoCtrl: AbstractControl,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // TODO: implementar el AsyncValidatorFn.
    // 1. Lee el valor a validar (control.value) y el tipo de documento (tipoDocumentoCtrl.value).
    // 2. Según el tipo, llama a documentoService.consultarRuc(valor) o documentoService.consultarDni(valor).
    //    Ambos devuelven un Observable<DatosRuc | DatosDni | null> (null = no encontrado).
    // 3. Usa el operador `map` para transformar esa respuesta en lo que espera un AsyncValidatorFn:
    //    - si se encontraron datos -> null (sin error)
    //    - si no se encontró -> { documentoNoEncontrado: true }
    // Tip: si guardas el observable de la consulta en una variable antes del .pipe(),
    // tipéala explícitamente como Observable<DatosDni | DatosRuc | null> para evitar
    // un problema de tipado de TS al resolver el overload de `.pipe()` sobre una unión.

    const numeroDocumento = control.value
    const tipoDocumento = tipoDocumentoCtrl.value
    let observable$: Observable<DatosDni | DatosRuc | null>


    if(tipoDocumento === 'DNI'){
      observable$ = documentoService.consultarDni(numeroDocumento)
    }else{
      observable$ = documentoService.consultarRuc(numeroDocumento)
    }

    return observable$.pipe(
      map((data) => data === null ? {documentoNoEncontrado: true} : null)
    )
  };
}
