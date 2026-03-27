import { Component } from '@angular/core';
import { BookingService } from '../shared/booking.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  errorMessage: string | null = null;
  private readonly user = 'Jhon Doe';

  constructor(public bookingService: BookingService) {}

  private sameDay(a: Date | undefined, b: Date | null): boolean {
    if (!a || !b) return false;
    return a.toDateString() === b.toDateString();
  }

  get currentDesk(): string | null {
    return this.bookingService.selectedDesk;
  }

  get currentDate(): Date | null {
    return this.bookingService.selectedDate;
  }

  get currentDateValid(): boolean {
    return this.bookingService.selectedDateValid;
  }

  get bookedDesk(): string | null {
    const date = this.currentDate;
    if (!date) return null;

    const booking = this.bookingService.getBookingFor(this.user, date);
    return booking ? booking.deskId : null;
  }

  get buttonLabel(): string {
    return this.bookedDesk ? 'Withdraw booking' : 'Book Now';
  }

  bookNow() {
    if (!this.currentDate || !this.currentDateValid) {
      this.showError('A day must be selected first');
      return;
    }

    if (!this.bookedDesk && !this.currentDesk) {
      this.showError('A desk must be selected first');
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

  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = null), 3000);
  }
}
