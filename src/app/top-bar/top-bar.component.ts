import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { BookingService, Booking } from '../shared/booking.service';

function sameDay(a: Date | undefined, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.toDateString() === b.toDateString();
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent implements OnDestroy {
  currentDesk: string | null = null;
  currentDate: Date | null = null;
  currentDateValid = true;
  bookedDesk: string | null = null;
  errorMessage: string | null = null;

  private subs: Subscription = new Subscription();
  private readonly user = 'Vincze Norbert';

  constructor(private bookingService: BookingService) {
    this.subs.add(
      combineLatest([
        this.bookingService.selectedDesk$,
        this.bookingService.selectedDate$,
        this.bookingService.selectedDateValid$,
        this.bookingService.bookings$,
      ]).subscribe(([desk, date, valid, bookings]) => {
        this.currentDesk = desk;
        this.currentDate = date;
        this.currentDateValid = valid;

        if (date) {
          const existing = bookings.find(
            (b) => b.user === this.user && sameDay(b.date, date),
          );
          this.bookedDesk = existing ? existing.deskId : null;
        } else {
          this.bookedDesk = null;
        }
      }),
    );
  }

  get buttonLabel(): string {
    return this.bookedDesk ? 'Withdraw booking' : 'Book Now';
  }

  get canAct(): boolean {
    return true;
  }

  bookNow() {
    if (!this.currentDate || !this.currentDateValid) {
      this.errorMessage = 'a day must be selected first';
      setTimeout(() => (this.errorMessage = null), 3000);
      return;
    }

    if (!this.bookedDesk && !this.currentDesk) {
      this.errorMessage = 'a desk must be selected first';
      setTimeout(() => (this.errorMessage = null), 3000);
      return;
    }

    if (this.bookedDesk && this.currentDate) {
      this.bookingService.removeBooking(this.user, this.currentDate);
      this.bookingService.selectDesk(null);
    } else if (this.currentDesk && this.currentDate) {
      this.bookingService.addBooking({
        user: this.user,
        deskId: this.currentDesk,
        date: this.currentDate,
      });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
