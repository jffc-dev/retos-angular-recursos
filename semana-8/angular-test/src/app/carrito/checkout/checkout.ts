import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../cart.service';
import { DocumentoService } from '../documento.service';
import { ProductoService } from '../producto.service';
import { documentoExisteAsyncValidator, documentoFormatoValidator } from '../validators/documento.validator';
import { stockAsyncValidator } from '../validators/stock.validator';

type TipoDocumento = 'DNI' | 'RUC';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
})
export class Checkout {
  private readonly fb = inject(FormBuilder);
  protected readonly cart = inject(CartService);
  private readonly productoService = inject(ProductoService);
  private readonly documentoService = inject(DocumentoService);
  private readonly router = inject(Router);

  protected readonly compraConfirmada = signal(false);

  protected readonly tipoDocumento = this.fb.nonNullable.control<TipoDocumento>('DNI', {
    validators: Validators.required,
  });

  protected readonly form = this.fb.group({
    tipoDocumento: this.tipoDocumento,
    numeroDocumento: this.fb.nonNullable.control('', {
      validators: [Validators.required, documentoFormatoValidator(this.tipoDocumento)],
      asyncValidators: [documentoExisteAsyncValidator(this.documentoService, this.tipoDocumento)],
      updateOn: 'blur' as const,
    }),
    nombres: this.fb.nonNullable.control('', Validators.required),
    apellidos: this.fb.nonNullable.control('', Validators.required),
    razonSocial: this.fb.nonNullable.control({ value: '', disabled: true }),
    direccion: this.fb.nonNullable.control('', Validators.required),
    telefono: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^9\d{8}$/)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    items: this.fb.array(
      this.cart.items().map((item) => this.crearLineaItem(item.producto.id, item.producto.nombre, item.cantidad)),
    ),
  });

  constructor() {
    if (this.cart.items().length === 0) {
      this.router.navigateByUrl('/carrito');
    }

    // TODO: suscribirse a this.tipoDocumento.valueChanges y, en cada cambio,
    // llamar a this.alCambiarTipoDocumento(tipo) para habilitar/deshabilitar los
    // campos correspondientes.

    this.tipoDocumento.valueChanges.subscribe((value) => {
      console.log(value)
      this.alCambiarTipoDocumento(value)
    })
  }

  private crearLineaItem(productoId: string, nombreProducto: string, cantidadInicial: number) {
    return this.fb.nonNullable.group({
      productoId: this.fb.nonNullable.control(productoId),
      nombreProducto: this.fb.nonNullable.control(nombreProducto),
      cantidad: this.fb.nonNullable.control(cantidadInicial, {
        validators: [Validators.required, Validators.min(1)],
        asyncValidators: [stockAsyncValidator(this.productoService, productoId)],
        updateOn: 'blur' as const,
      }),
    });
  }

  private alCambiarTipoDocumento(tipo: TipoDocumento): void {
    // TODO: implementar el enable()/disable() dinámico según el tipo de documento.
    // - Si tipo === 'DNI': habilitar nombres y apellidos, deshabilitar razonSocial
    //   (this.form.controls.nombres.enable() / .disable()) y limpiar razonSocial con reset('').
    // - Si tipo === 'RUC': lo inverso (habilitar razonSocial, deshabilitar nombres y apellidos,
    //   limpiándolos con reset('')).
    // - En ambos casos, resetea numeroDocumento (this.form.controls.numeroDocumento.reset(''))
    //   para que se revalide contra el nuevo tipo la próxima vez que se complete.

    if(tipo === 'DNI'){
      this.form.controls.razonSocial.disable()
      this.form.controls.nombres.enable()
      this.form.controls.apellidos.enable()
      this.form.controls.razonSocial.reset('')
    } else { //RUC
      this.form.controls.razonSocial.enable()
      this.form.controls.nombres.disable()
      this.form.controls.apellidos.disable()
      this.form.controls.nombres.reset('')
      this.form.controls.apellidos.reset('')
    }

    this.form.controls.numeroDocumento.reset('')
  }

  confirmar(): void {
    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      return;
    }

    for (const linea of this.form.controls.items.controls) {
      const { productoId, cantidad } = linea.getRawValue();
      this.productoService.reducirStock(productoId, cantidad);
    }

    this.cart.clear();
    this.compraConfirmada.set(true);
  }
}
