import { Injectable } from '@angular/core';
import { Invoice } from '../interfaces/invoice-interface';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    private  http:HttpClient
  ) { } 

  getInvoiceData(){
   return this.http.get<Invoice[]>(`${apiUrl}/invoices`)
  }
  
  createInvoiceItem(invoiceFormData, total){
    const createInvoiceIdData= {
      customer_id: invoiceFormData.customer_id,
      discount: invoiceFormData.discount,
      total: total
    };
    console.log(invoiceFormData)
  return this.http.post(`${apiUrl}/invoices`, createInvoiceIdData)
    .pipe( 
      switchMap((data: any) => {
        const items$ = invoiceFormData.customForm.map(items => {
          const createInvoiceItemData = {
            invoice_id: data.id,
            product_id: items.item.product_id,
            quantity: items.item.quantity
          };
          return this.http.post(`${apiUrl}/invoices/${data.id}/items`, createInvoiceItemData);
        })
        return forkJoin(items$);
      })
    )
  }
}
