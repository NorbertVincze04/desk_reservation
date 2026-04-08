import { Component } from '@angular/core';
import { BookingService } from '../../core/booking.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  errorMessage: string | null = null;
  isLoading = false;

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

    const booking = this.bookingService.getBookingFor(
      this.bookingService.user,
      date,
    );
    return booking ? booking.deskId : null;
  }

  get buttonLabel(): string {
    return this.bookedDesk ? 'Withdraw booking' : 'Book Now';
  }

  get isButtonDisabled(): boolean {
    if (this.isLoading) return true;
    if (this.bookedDesk) return false;
    return !this.currentDateValid || !this.currentDesk;
  }

  bookNow() {
    this.isLoading = true;

    if (this.bookedDesk && this.currentDate) {
      this.bookingService
        .removeBooking(this.bookingService.user, this.currentDate)
        .subscribe({
          next: (success) => {
            this.isLoading = false;
            if (!success) {
              this.showError('Failed to withdraw booking');
            }
          },
          error: () => {
            this.isLoading = false;
            this.showError('Failed to withdraw booking');
          },
        });
    } else if (this.currentDesk && this.currentDate) {
      this.bookingService
        .addBooking({
          id: '',
          user: this.bookingService.user,
          deskId: this.currentDesk,
          date: this.currentDate,
        })
        .subscribe({
          next: (success) => {
            this.isLoading = false;
            if (!success) {
              this.showError('Failed to book desk');
            }
          },
          error: () => {
            this.isLoading = false;
            this.showError('Failed to book desk');
          },
        });
    }
  }

  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = null), 3000);
  }
}
