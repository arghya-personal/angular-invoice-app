import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../interfaces/customer-interface';
import { CustomerSubmitData } from '../interfaces/customersubmit-interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})

export class CustomerComponent implements OnInit {

  customer: Customer[] = [];
  tableColumns:  string[] = ['customerName', 'Phone', 'Address'];
  customerForm: FormGroup;
  submitFormData: CustomerSubmitData = {
    name: '',
    address: '',
    phone: ''
  };

  constructor (
    private customerservice: CustomerService,
    private formBuilder: FormBuilder,
  ) {
    this.customerForm = this.customerFormCreate(this.formBuilder);
  }

  ngOnInit() {
    this.customerData();
  }
  customerFormCreate(formBuilder: FormBuilder) {
    {
      return formBuilder.group({
        name: [this.submitFormData.name],
        address: [this.submitFormData.address],
        phone: [this.submitFormData.phone]
      });
    }
  }
  onFormSubmit() {
    const submit: CustomerSubmitData = Object.assign({}, this.customerForm.value);
    this.customerservice.postCustomerData(submit).subscribe(data => {
     console.log('Submited', data);
      this.customerData();
    });
  }

  customerData() {
    this.customerservice.getCustomerData().subscribe(data => {
      this.customer = data;
    });
  }
}

