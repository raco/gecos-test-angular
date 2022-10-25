import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FilterProductsPipe } from './filter-products.pipe';

@NgModule({
  declarations: [ProductComponent, ProductFormComponent, FilterProductsPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    FormsModule,
    SharedModule,
  ],
})
export class ProductModule {}
