import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
} from '@angular/forms';

import { Customer } from './customer';
import { debounceTime } from 'rxjs';
import jsonData from '../../assets/data.json';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl?.pristine || confirmControl?.pristine) {
    return null;
  }

  if (emailControl?.value === confirmControl?.value) {
    return null;
  }

  return { match: true };
}

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (
      c.value !== null &&
      (isNaN(c.value) || c.value < min || c.value > max)
    ) {
      return { range: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();
  emailMessage!: string;
  data: any = jsonData;
  states: string[] = [];
  localGoverments: string[] = [];
  keyLocal: string[] = [];
  k: string = '';

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.',
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    for (let prop in this.data) {
      this.k = prop;
      // console.log('data',this.data[this.k.length])
      this.keyLocal = this.data[this.k];
      // console.log(this.keyLocal)
    }

    console.log(this.keyLocal);
    // console.log('Data', this.data);
    this.states = Object.keys(this.data);
    console.log(this.states);
    // console.log('data',this.data[Object.keys(this.data)[8]]);
    this.keyLocal = this.data[Object.keys(this.data)[8]];
    console.log(this.keyLocal);

    // selectedStateData = statesData.find(state => state.name === this.selectedState);

    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', Validators.required],
        },
        { validator: emailMatcher }
      ),
      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1, 5)],
      sendCatalog: true,
      addresses: this.fb.array([this.buildAddress()]),
      address: this.fb.group({
        addressType: 'home',
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: '',
      }),
    });

    this.customerForm
      .get('notification')
      ?.valueChanges.subscribe((value) => this.setNotification(value));

    this.customerForm
      .get('address')
      ?.get('state')
      ?.valueChanges.subscribe((value) => this.setLocalGoverment(value));
    // const emailControl = this.customerForm.get('emailGroup.email');
    // emailControl?.valueChanges.pipe(
    //   debounceTime(1000)).subscribe(
    //   value => this.setMessage(emailControl)
    // )
  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    });
  }

  populateTestData(): void {
    this.customerForm.setValue({
      firstName: 'Jack',
      lastName: 'Harkness',
      email: 'jack@torchwood.com',
      sendCatalog: false,
    });
  }

  // setMessage(c: AbstractControl): void {
  //   this.emailMessage = '';
  //   if ((c.touched || c.dirty) && c.errors) {
  //     this.emailMessage = Object.keys(c.errors).map(
  //       key => this.validationMessages[key]).join('');
  //   }
  // }

  // localGovt(){
  //   return this.selectedStateData ? this.selectedStateData.localGovernments : [];
  // }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl?.setValidators(Validators.required);
    } else {
      phoneControl?.clearValidators();
    }
    phoneControl?.updateValueAndValidity();
  }

  setLocalGoverment(localState: string): void {
    if (localState === 'Abia') {
      this.localGoverments = this.data[Object.keys(this.data)[0]];
    } else if (localState === 'Adamawa') {
      this.localGoverments = this.data[Object.keys(this.data)[1]];
    } else {
      this.localGoverments = [];
    }
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
}
