import { Component } from '@angular/core';
import { BookingService } from '../../core/booking.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  officeGroups = ['A', 'B', 'C', 'D'];
  deskNumbers = [1, 2, 3, 4];
  private user = 'John Doe';

  constructor(public bookingService: BookingService) {}

  private sameDay(a: Date | undefined, b: Date | null): boolean {
    if (!a || !b) return false;
    return a.toDateString() === b.toDateString();
  }

  getStatus(groupId: string, deskNum: number): string {
    const id = groupId + deskNum;
    const date = this.bookingService.selectedDate;
    const valid = this.bookingService.selectedDateValid;

    if (!valid || !date) {
      return 'booked';
    }

    const bookedDesk = this.bookingService.bookings.find(
      (booking) => booking.deskId === id && this.sameDay(booking.date, date),
    );

    if (bookedDesk) {
      return bookedDesk.user === this.user ? 'mine' : 'booked';
    }

    if (this.bookingService.selectedDesk === id) {
      return 'selected';
    }

    return 'available';
  }

  toggleDesk(groupId: string, deskNum: number) {
    const dateValid = this.bookingService.selectedDateValid;
    const date = this.bookingService.selectedDate;

    if (!dateValid || !date) {
      return;
    }

    const id = groupId + deskNum;
    const status = this.getStatus(groupId, deskNum);

    if (status === 'available') {
      this.bookingService.selectDesk(id);
    } else if (status === 'selected') {
      this.bookingService.selectDesk(null);
    }
  }
}
