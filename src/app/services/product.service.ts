import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  API_ROUTE_PRODUCT = environment.api + '/product';

  constructor(private http: HttpClient) {}

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_ROUTE_PRODUCT}`);
  }

  get(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_ROUTE_PRODUCT}/${productId}`, {});
  }

  create(product: Product): Observable<any> {
    return this.http.post<Product>(`${this.API_ROUTE_PRODUCT}`, product);
  }

  update(product: Product): Observable<any> {
    return this.http.put<Product>(`${this.API_ROUTE_PRODUCT}`, product);
  }

  regen(): Observable<any> {
    return this.http.post(`${this.API_ROUTE_PRODUCT}/seed`, {});
  }

  delete(productId: string): Observable<any> {
    return this.http.delete(`${this.API_ROUTE_PRODUCT}/${productId}`, {});
  }
}
