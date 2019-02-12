import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NG_VALIDATORS, FormControl } from '@angular/forms';
import {  forwardRef } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../interfaces/product-interface';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface invoiceItemData {
  items: InvoiceItem,
}
export interface InvoiceItem{
  productID: number,
  quantity: number,
}

@Component({
  selector: 'app-custom-product-form',
  templateUrl: './custom-product-form.component.html',
  styleUrls: ['./custom-product-form.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomProductFormComponent),
      multi: true
    }
  ]
})

export class CustomProductFormComponent implements ControlValueAccessor ,OnInit {

  customProductForm : FormGroup;

  invoiceItemData: invoiceItemData = {
   items: {productID:0, quantity:1}
  }

  ngOnInit() {
    this.customProDuctForm();
    this.onProductChange();
  } 

  @Input()
  dropDownProductData: Product[] = []
  propagateChange = (_: any) => {};

  writeValue(value:any){
  if (!value) {
   this.dropDownProductData = value
   //console.log(value)
  }
 
}

  registerOnChange(fn){
    this.propagateChange = fn;
  }

  registerOnTouched(fn){
  }

  onProductChange(){
    this.customProductForm.valueChanges.subscribe(value => {
     //console.log(value);
      this.propagateChange(value);
    })
  }

  constructor(
    private formBuilder:FormBuilder
  ) { }

  customProDuctForm(){
  this.customProductForm = this.formBuilder.group({
    'product_id': [this.invoiceItemData.items.productID],
    'quantity': [this.invoiceItemData.items.quantity]
  })
  }   
}

