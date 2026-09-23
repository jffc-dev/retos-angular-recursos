# AngularCaptcha

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Claves de prueba de Turnstile

Cloudflare publica pares de claves ficticias para desarrollo. No hablan con la red
de Cloudflare: devuelven siempre el mismo resultado, así que sirven para probar
cada camino del código (éxito, rechazo, token gastado) sin depender de un reto
real ni de un dominio registrado.

En este proyecto se usan en [`src/environments/environment.development.ts`](src/environments/environment.development.ts)
(site key, va al navegador) y en `supabase/functions/.env` (secret key, solo servidor).

### Site keys (frontend)

| Site key | Comportamiento | Cuándo usarla |
| --- | --- | --- |
| `1x00000000000000000000AA` | Siempre pasa, widget visible | Caso feliz. Es la que trae el proyecto por defecto. |
| `2x00000000000000000000AB` | Siempre bloquea, widget visible | Ver cómo se comporta la UI cuando el widget falla y nunca entrega token. |
| `1x00000000000000000000BB` | Siempre pasa, modo invisible | Probar el flujo sin widget a la vista. |
| `2x00000000000000000000BB` | Siempre bloquea, modo invisible | Fallo silencioso: el usuario no ve nada y el submit no debería avanzar. |
| `3x00000000000000000000FF` | Fuerza un reto interactivo | Ver el reto manual, que en producción solo aparece ante tráfico sospechoso. |

### Secret keys (Edge Function)

| Secret key | Respuesta de siteverify | Cuándo usarla |
| --- | --- | --- |
| `1x0000000000000000000000000000000AA` | Siempre `success: true` | Caso feliz. Es la que hay que poner en `TURNSTILE_SECRET` para desarrollo. |
| `2x0000000000000000000000000000000AA` | Siempre `success: false` | Probar la rama `reason: "rejected"` de la función, con un token que el widget sí generó. |
| `3x0000000000000000000000000000000AA` | Error `timeout-or-duplicate` | Simular un token ya canjeado: es lo que pasa si se reenvía el mismo token dos veces. |

### Cómo combinarlas

Site key y secret key son independientes, y ahí está lo útil: mezclándolas se
provocan escenarios que con claves reales cuesta reproducir.

- `1x...AA` + `1x...AA` → login correcto de principio a fin.
- `1x...AA` + `2x...AA` → el navegador cree que resolvió el reto, pero el servidor
  lo rechaza. Es el caso que justifica verificar en el backend: demuestra que el
  token del cliente no es prueba de nada por sí solo.
- `1x...AA` + `3x...AA` → token gastado, la respuesta que daría Cloudflare ante un
  intento de replay.

En producción hay que reemplazar ambas por las claves reales del dashboard de
Cloudflare. Con las de prueba cualquiera pasa la verificación.
