import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { BookingService, Booking } from '../shared/booking.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnDestroy {
  bookings: Booking[] = [];
  private subs: Subscription = new Subscription();

  private sameDay(a: Date | undefined, b: Date | null): boolean {
    if (!a || !b) return false;
    return a.toDateString() === b.toDateString();
  }

  constructor(private bookingService: BookingService) {
    this.subs.add(
      combineLatest([
        this.bookingService.bookings$,
        this.bookingService.selectedDate$,
      ]).subscribe(([all, date]) => {
        if (date) {
          this.bookings = all.filter((b) => this.sameDay(b.date, date));
        } else {
          this.bookings = [];
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
