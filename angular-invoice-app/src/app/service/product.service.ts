import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Product } from '../interfaces/product-interface';
import { environment } from '../../environments/environment';
import {tap} from 'rxjs/operators';

const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  getProductData(){
   return  this.http.get<Product[]>(`${apiUrl}/products`)
  }
  postProductData(productSubmit){
    return this.http.post(`${apiUrl}/products`,productSubmit)
  }
}
