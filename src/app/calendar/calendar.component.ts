import { Component } from '@angular/core';
import { BookingService } from '../shared/booking.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  selectedDate: Date | null = null;
  minDate: Date = new Date();
  limitDate: Date = this.calculateLimitDays(new Date(), 3);
  disabledDays: number[] = [0, 6];
  warningMessage: string | null = null;

  constructor(private bookingService: BookingService) {}

  onDateChange(selectedDate: Date | null) {
    this.selectedDate = selectedDate;
    this.validateBookingDate(selectedDate);

    const valid = selectedDate != null && this.warningMessage === null;
    this.bookingService.selectDate(selectedDate, valid);
  }

  calculateLimitDays(startDate: Date, daysToAdd: number): Date {
    let resultDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      resultDate.setDate(resultDate.getDate() + 1);
      const dayOfWeek = resultDate.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }

    return resultDate;
  }

  validateBookingDate(date: Date | null) {
    if (!date) {
      this.warningMessage = null;
      return;
    }

    if (date > this.limitDate) {
      this.warningMessage =
        'You can only make a reservation for the next 3 days.';
    } else {
      this.warningMessage = null;
    }
  }
}
