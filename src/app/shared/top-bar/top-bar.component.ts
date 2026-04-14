import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from '../../core/booking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  isLoading = false;
  currentDesk: string | null = null;
  currentDate: Date | null = null;
  bookedDesk: string | null = null;
  currentUser: string = '';
  dateValid: boolean = true;

  private subscription = new Subscription();

  constructor(public bookingService: BookingService) {}

  ngOnInit() {
    this.subscription.add(
      this.bookingService.selectedDesk$.subscribe((desk) => {
        this.currentDesk = desk;
      }),
    );

    this.subscription.add(
      this.bookingService.selectedDate$.subscribe((date) => {
        this.currentDate = date;
        this.updateBookedDesk();
      }),
    );

    this.subscription.add(
      this.bookingService.bookings$.subscribe(() => {
        this.updateBookedDesk();
      }),
    );

    this.subscription.add(
      this.bookingService.user$.subscribe((user) => {
        this.currentUser = user;
        this.updateBookedDesk();
      }),
    );

    this.subscription.add(
      this.bookingService.notifications$.subscribe((notification) => {
        if (notification.type === 'error') {
          this.showError(notification.message);
        }
      }),
    );

    this.subscription.add(
      this.bookingService.validation$.subscribe((validation) => {
        this.dateValid = validation.valid;
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateBookedDesk() {
    if (!this.currentDate) {
      this.bookedDesk = null;
      return;
    }

    const booking = this.bookingService.getBookingFor(
      this.currentUser,
      this.currentDate,
    );
    this.bookedDesk = booking ? booking.deskId : null;
  }

  get buttonLabel(): string {
    return this.bookedDesk ? 'Withdraw booking' : 'Book Now';
  }

  get isButtonDisabled(): boolean {
    if (this.isLoading) return true;
    if (!this.dateValid) return true;
    if (this.bookedDesk) return false;
    return !this.currentDate || !this.currentDesk;
  }

  bookNow() {
    this.isLoading = true;

    if (this.bookedDesk && this.currentDate) {
      this.bookingService
        .removeBooking(this.currentUser, this.currentDate)
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
          user: this.currentUser,
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
