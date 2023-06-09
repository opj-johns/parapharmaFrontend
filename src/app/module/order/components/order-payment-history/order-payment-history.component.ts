import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentDialogData } from 'src/app/model/payment-dialog-data';
import { PaymentService } from 'src/app/service/payment.service';

@Component({
  selector: 'app-order-payment-history',
  templateUrl: './order-payment-history.component.html',
  styleUrls: ['./order-payment-history.component.scss']
})
export class OrderPaymentHistoryComponent implements OnInit {

  displayedColumns: string[] = ['typeOfPayment', 'amountPaid', 'date', 'time'];
  dataSource!: MatTableDataSource<PaymentDialogData>;
  totalAmountPaid: number=0;

  @Output("amountPaid") amountPaid = new EventEmitter<number>();

  @Input("order-id") orderId!: number;
  paymentHistories!: PaymentDialogData[];

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.fetchPaymentHistory();
    console.log('Order id received in ordered-products-table', this.orderId);
  }

  fetchPaymentHistory(){
    this.paymentService.fetchDialogPaymentData(this.orderId).subscribe({
      next:(data)=>{
        console.log("Fetched payment histories", data);
        this.paymentHistories = data;
        this.dataSource = new MatTableDataSource(data);
        this.calculateTotalAmountPaid();
      },
      error:(err)=>{
        console.log("Error fetching payment history", err);
      }
    })
  }

  calculateTotalAmountPaid(){
    this.paymentHistories.forEach(history=>{
      this.totalAmountPaid += history.amountPaid;
    })
    this.emitAmountPaid();
  }

  emitAmountPaid(){
    this.amountPaid.emit(this.totalAmountPaid);
  }
}
