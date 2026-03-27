import { Component } from '@angular/core';
import { BookingService, Booking } from '../shared/booking.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  constructor(public bookingService: BookingService) {}

  private sameDay(a: Date | undefined, b: Date | null): boolean {
    if (!a || !b) return false;
    return a.toDateString() === b.toDateString();
  }

  get bookings(): Booking[] {
    const date = this.bookingService.selectedDate;
    if (!date) return [];
    return this.bookingService.bookings.filter((b) =>
      this.sameDay(b.date, date),
    );
  }
}
