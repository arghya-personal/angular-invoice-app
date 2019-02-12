import { Component, OnInit } from '@angular/core';
import { Invoice } from '../interfaces/invoice-interface';
import { InvoiceService } from '../service/invoice.service';
import { CustomerService } from '../service/customer.service';
import { ProductService } from '../service/product.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Customer } from '../interfaces/customer-interface';
import { Product } from '../interfaces/product-interface';
import { CustomProductFormComponent, invoiceItemData } from '../custom-product-form/custom-product-form.component';

export interface InvoiceFormData {
  customer_id: number;
  discount: number;
  customForm: InvoiceItem;
}

export interface InvoiceItem {
  product_id: number;
  quantity: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  ProductItemsArr: InvoiceFormData[] = [];
  dropDownCustomerData: Customer[] = [];
  dropDownProductData: Product[] = [];
  invoice: Invoice[] = [];
  total: number = 0;
  invoicerForm: FormGroup;
  customForm: FormArray;
  tableColumns:  string[] = ['id', 'discount', 'total'];

  InvoiceFormData: InvoiceFormData = {
    customer_id: 0,
    discount: 0,
    customForm: {product_id: 0, quantity: 1},
  };

  constructor(
   private invoiceservice: InvoiceService,
   private formBuilder: FormBuilder,
   private customerservice: CustomerService,
   private productservice: ProductService
  ) {
    }

  ngOnInit() {
    this.getInvoiceData();
    this.invoicerForm = this.invoiceItemCreate(this.formBuilder);
    this.dropDownCustomer();
    this.dropDownProduct();
    this.onChange();
  }

  getInvoiceData() {
    this.invoiceservice.getInvoiceData().subscribe( data => {
      this.invoice = data;
    });
  }

  onChange() {
    this.invoicerForm.valueChanges.subscribe(val => {
      const price = val.customForm.map(items => {
        if (items.item && items.item.product_id) {
        return(
          this.dropDownProductData.find(ite => ite.id === +items.item.product_id).price  * +items.item.quantity
        );
        } else {
          return 0;
        }
      });
      const totalPrice = price.reduce((a, b) => a + b);
      const discount = totalPrice - (totalPrice * val.discount / 100 );
      this.total =  discount;
    });
  }
  invoiceItemCreate(formBuilder: FormBuilder) {
    return formBuilder.group({
      customer_id: [this.InvoiceFormData.customer_id],
      discount: [this.InvoiceFormData.discount],
     // items: this.formBuilder.array([this.createItem()]),
      customForm: this.formBuilder.array([this.createItem()])
    });
  }

  createItem() {
    return this.formBuilder.group({
      'item': [],
    });
  }

  addItem() {
    (<FormArray>this.invoicerForm.get('customForm')).push(this.createItem());
  }

  dropDownCustomer() {
    this.customerservice.getCustomerData().subscribe(data => {
      this.dropDownCustomerData = data;
    });
  }

  dropDownProduct() {
    this.productservice.getProductData().subscribe( data => {
      this.dropDownProductData =  data;
    });
  }

  submitForm() {
    // console.log(this.invoicerForm.value)
    const submit: InvoiceFormData = Object.assign({}, this.invoicerForm.value);
    this.invoiceservice.createInvoiceItem(submit, this.total).subscribe(data => {
    // console.log("Submited", data);
    this.getInvoiceData();
    });
  }
}

