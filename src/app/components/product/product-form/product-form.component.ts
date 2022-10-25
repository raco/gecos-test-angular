import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

enum Titles {
  Edit = 'Editar',
  View = 'Articulo',
  Create = 'Alta',
}

enum Actions {
  Edit,
  View,
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject<boolean>();
  title: string = Titles.Create;
  action: Actions = Actions.View;
  form: FormGroup = new FormGroup({
    id: new FormControl({ value: '', disabled: true }),
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.has('id')) {
      const id = this.route.snapshot.paramMap.get('id') ?? '';
      this.title = Titles.View;
      this.productService
        .get(id)
        .pipe(
          takeUntil(this.onDestroy$),
          tap((product: Product) => this.form.patchValue(product)),
          switchMap(() => this.route.queryParams)
        )
        .subscribe((params) => {
          if (params['action'] === 'edit') {
            this.title = Titles.Edit;
            this.action = Actions.Edit;
          } else {
            this.title = Titles.View;
            this.form.disable();
          }
        });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.action === Actions.Edit
        ? this.productService
            .update({
              ...this.form.value,
              id: this.form.controls['id'].value,
            })
            .pipe(
              tap(() => this.snackBar.open('Producto editado con exito', 'Ok'))
            )
            .subscribe()
        : this.productService
            .create(this.form.value)
            .pipe(
              tap(() => this.snackBar.open('Producto creado con exito', 'Ok'))
            )
            .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
