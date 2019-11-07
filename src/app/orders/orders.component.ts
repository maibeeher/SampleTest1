import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlexModalService } from '../shared-components/flex-modal/flex-modal.service';
import { Http } from '@angular/http';
import { fadeInItems } from '@angular/material';

interface IOrder {
  pid: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  orders: Array<IOrder> = [];
  nameInput = '';
  confirmMessage = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private flexModal: FlexModalService,
    private http: Http
  ) {

  }

  async ngOnInit() {

  }

  // prepare result, splice last name, first name

  // Calculate total and perform input validation
  calculate() {
    console.log('nameInput', this.nameInput);
    let subTotal, total, taxAmt;
    total = this.orders.reduce((acc, it, i, arr) => {
      acc += it.price * it.quantity;
      return acc;
    }, 0);
    taxAmt = .1 * total;
    subTotal = total - taxAmt;
    if (this.nameInput === '' && total === 0) {
      this.errorMessage = 'Name and calculation must be made before continuing';
      this.flexModal.openDialog('error-modal');
    } else if (this.nameInput === '' ) {
      this.errorMessage = 'Name must not be empty!';
      this.flexModal.openDialog('error-modal');
      // alert('Name must not be empty!');
    } else if (this.nameInput.indexOf(',') === -1) {
      this.flexModal.openDialog('error-modal');
      this.errorMessage = 'Must have a comma!';
      // alert('Must have a comma!');
    } else {
      // do calculation
      if (total === 0) {
        this.errorMessage = 'Calculations must be made before continuing';
        this.flexModal.openDialog('error-modal');
      } else {
        console.log('total ---->', total, 'taxAmt--->', taxAmt, 'sub--->', subTotal);
        // alert(`Thank You, ${this.nameInput} Here is your order details: ${total}, ${taxAmt}, ${subTotal}`);

        this.confirmMessage = `Thank You, ${this.nameInput}. Here is your order details:Total:$${total},Tax:$${taxAmt},SubTotal:$${subTotal}`;
        this.flexModal.openDialog('confirm-modal');

      }


      // this.errorMessage = `Warning! First Name, Last Name must be defined!`;
      // this.flexModal.openDialog('error-modal');

    }
  }
  // display the order form with orders from orders.json

  // Clear the orders form
  clear() {
    this.orders.forEach((item, i) => {
      item.quantity = null;
      item.price = null;
      item.pid = null;
      item.description = null;
    });
  }

  // Add items 'Hot Dog', 'Hamberger' and 'Pizza' to list when corresponding button is clicked
  // addItem('Hamburger');
  addItem(item: string) {
    switch (item) {
      case 'Hot Dog':
        this.orders.unshift({
          'pid': '1',
          'image': 'assets/sm_hotdog.jpeg',
          'description': 'Hot Dog',
          'price': 5.00,
          'quantity': null
        });
        break;
      case 'Hamberger':
        this.orders.unshift({
          'pid': '2',
          'image': 'assets/sm_hamberger.jpeg',
          'description': 'Hamberger',
          'price': 6.00,
          'quantity': null
        });
        break;
      case 'Pizza':
        this.orders.unshift({
          'pid': '3',
          'image': 'assets/sm_pizza.jpeg',
          'description': 'Large Pizza',
          'price': 12.00,
          'quantity': null
        });
        break;
    }
  }
  // delete line item (order) when delete button is click
  delete(index: number) {
    console.log('index', index);
    this.orders.splice(index, 1);
  }
  // read in the orders.json file and populate the list table with the initial orders (3)

  async readFile() {
    const rows = await this.http.get('assets/orders.json').toPromise();
    console.log('rows', rows.json());
    this.orders = rows.json();
    return rows.json();
  }

}
