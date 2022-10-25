import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { DialogComponent } from 'src/app/modules/shared/dialog/dialog.component';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  searchQuery = '';
  onDestroy$ = new Subject<boolean>();
  products$!: Observable<Product[] | null>;
  refreshList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.products$ = this.refreshList.asObservable().pipe(
      takeUntil(this.onDestroy$),
      switchMap(() => this.productService.list())
    );
  }

  regen(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {
        title: 'Regenerar Lista',
        description: 'Estas seguro que quieres regenerar la lista?',
        leftButton: 'No',
        rightButton: 'Regenerar',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.onDestroy$),
        filter((result: boolean) => result),
        switchMap(() => this.productService.regen()),
        tap(() => this.refreshList.next(true)),
        tap(() => this.snackBar.open('Lista regenerada', 'Ok'))
      )
      .subscribe();
  }

  deleteProductDialog(productId: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {
        title: 'Eliminar Producto',
        description: 'Estas seguro que quieres eliminar este producto?',
        leftButton: 'No',
        rightButton: 'Eliminar',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.onDestroy$),
        filter((result: boolean) => result),
        switchMap(() => this.productService.delete(productId)),
        tap(() => this.refreshList.next(true)),
        tap(() => this.snackBar.open('Producto eliminado', 'Ok'))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
