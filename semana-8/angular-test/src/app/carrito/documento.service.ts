import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

export interface DatosDni {
  nombres: string;
  apellidos: string;
}

export interface DatosRuc {
  razonSocial: string;
}

const DNIS_VALIDOS: Record<string, DatosDni> = {
  '12345678': { nombres: 'Juan Carlos', apellidos: 'Pérez Gómez' },
  '45678912': { nombres: 'María Elena', apellidos: 'Torres Ríos' },
  '71122334': { nombres: 'Diego Alonso', apellidos: 'Vargas Luna' },
};

const RUCS_VALIDOS: Record<string, DatosRuc> = {
  '20123456789': { razonSocial: 'Comercial Andina S.A.C.' },
  '20601234567': { razonSocial: 'Distribuidora Norte E.I.R.L.' },
  '10456789123': { razonSocial: 'Flores Castillo Negocios' },
};

/** Simula una consulta a RENIEC/SUNAT contra un servicio externo. */
@Injectable({ providedIn: 'root' })
export class DocumentoService {
  consultarDni(dni: string): Observable<DatosDni | null> {
    return of(DNIS_VALIDOS[dni] ?? null).pipe(delay(600));
  }

  consultarRuc(ruc: string): Observable<DatosRuc | null> {
    return of(RUCS_VALIDOS[ruc] ?? null).pipe(delay(600));
  }
}
