import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../interfaces/product-interface';
import {FormBuilder,FormGroup} from '@angular/forms';
import { ProductSubmit } from '../interfaces/productsubmit-interface'
 
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  product: Product[] = [ ]
  productColumn: string[] = ['productId','Name','Price']
  submitProduct: ProductSubmit = {
    id: 0,
    name:'',
    price:''
  }

  constructor(
    private productservice:ProductService,
    private formBuilder:FormBuilder
  ) { 
    this.productForm = this.productFormCreate(this.formBuilder)
  }

  ngOnInit() {
    this.productData();
    
  }
  
  productFormCreate(formBuilder:FormBuilder){
    return formBuilder.group({
     name:[this.submitProduct.name],
     price:[this.submitProduct.price] 
    })
  }

  onProductSubmit(){
    const submit: ProductSubmit = Object.assign({}, this.productForm.value);  
    //console.log(submit)
    this.productservice.postProductData(submit).subscribe(data => {
     console.log("Submited", data);
      this.productData();
    })
  }

  productData(){
    this.productservice.getProductData().subscribe(data =>{
      this.product = data
    })
  }
}
