import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Customer} from '../interfaces/customer-interface';
import { environment } from '../../environments/environment';
import {tap} from 'rxjs/operators';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient
  ) { }

  getCustomerData() {
   // return this.http.get()
    return this.http.get<Customer[]>(`${apiUrl}/customers`).pipe(
      tap(value => {
       // console.log(value)
      })
    );
  }
  postCustomerData(customerSubmitData) {
    return this.http.post(`${apiUrl}/customers`, customerSubmitData);
  }
}
