import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  formGroup!: FormGroup;
  minDate!: Date;
  disabledDays: number[] = [0, 6];
  warningMessage: string | null = null;
  limitDate!: Date;

  ngOnInit() {
    this.formGroup = new FormGroup({
      date: new FormControl<Date | null>(null),
    });

    const today = new Date();
    this.minDate = today;

    this.limitDate = this.calculateLimitDays(today, 3);

    this.formGroup.get('date')?.valueChanges.subscribe((selectedDate: Date) => {
      this.validateBookingDate(selectedDate);
    });
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
