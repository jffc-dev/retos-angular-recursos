import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { DatosDni, DatosRuc, DocumentoService } from '../documento.service';

const PATRON_DNI = /^\d{8}$/;
const PATRON_RUC = /^(10|15|17|20)\d{9}$/;

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
    const valor = (control.value ?? '').toString().trim();
    const consulta$: Observable<DatosDni | DatosRuc | null> =
      tipoDocumentoCtrl.value === 'RUC'
        ? documentoService.consultarRuc(valor)
        : documentoService.consultarDni(valor);

    return consulta$.pipe(map((datos) => (datos ? null : { documentoNoEncontrado: true })));
  };
}
