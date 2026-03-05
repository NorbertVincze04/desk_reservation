import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Booking {
  user: string;
  deskId: string;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private selectedDeskSubject = new BehaviorSubject<string | null>(null);
  selectedDesk$ = this.selectedDeskSubject.asObservable();

  private selectedDateSubject = new BehaviorSubject<Date | null>(null);
  selectedDate$ = this.selectedDateSubject.asObservable();

  private selectedDateValidSubject = new BehaviorSubject<boolean>(true);
  selectedDateValid$ = this.selectedDateValidSubject.asObservable();

  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  bookings$ = this.bookingsSubject.asObservable();

  selectDesk(deskId: string | null) {
    this.selectedDeskSubject.next(deskId);
  }

  selectDate(date: Date | null, valid: boolean = true) {
    this.selectedDateSubject.next(date);
    this.selectedDateValidSubject.next(valid);
  }

  addBooking(booking: Booking): boolean {
    const curr = this.bookingsSubject.value;
    const exists = curr.find(
      (b) =>
        b.user === booking.user &&
        b.date.toDateString() === booking.date.toDateString(),
    );
    if (exists) {
      return false;
    }

    this.bookingsSubject.next([...curr, booking]);

    if (this.selectedDeskSubject.value === booking.deskId) {
      this.selectDesk(null);
    }
    return true;
  }

  removeBooking(user: string, date: Date) {
    const curr = this.bookingsSubject.value;
    const filtered = curr.filter(
      (b) =>
        !(b.user === user && b.date.toDateString() === date.toDateString()),
    );
    this.bookingsSubject.next(filtered);

    const removedDesk = curr.find(
      (b) => b.user === user && b.date.toDateString() === date.toDateString(),
    )?.deskId;
    if (removedDesk && this.selectedDeskSubject.value === removedDesk) {
      this.selectDesk(null);
    }
  }

  getBookingFor(user: string, date: Date): Booking | undefined {
    return this.bookingsSubject.value.find(
      (b) => b.user === user && b.date.toDateString() === date.toDateString(),
    );
  }
}
