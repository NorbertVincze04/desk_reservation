import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from '../../core/booking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit, OnDestroy {
  officeGroups = ['A', 'B', 'C', 'D'];
  deskNumbers = [1, 2, 3, 4];

  selectedDate: Date | null = null;
  selectedDesk: string | null = null;
  bookings: any[] = [];
  currentUser: string = '';

  private subscription = new Subscription();

  constructor(public bookingService: BookingService) {}

  ngOnInit() {
    this.subscription.add(
      this.bookingService.selectedDate$.subscribe((date) => {
        this.selectedDate = date;
      }),
    );

    this.subscription.add(
      this.bookingService.selectedDesk$.subscribe((desk) => {
        this.selectedDesk = desk;
      }),
    );

    this.subscription.add(
      this.bookingService.bookings$.subscribe((bookings) => {
        this.bookings = bookings;
      }),
    );

    this.subscription.add(
      this.bookingService.user$.subscribe((user) => {
        this.currentUser = user;
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private sameDay(a: Date | undefined, b: Date | null): boolean {
    if (!a || !b) return false;
    return a.toDateString() === b.toDateString();
  }

  getStatus(groupId: string, deskNum: number): string {
    const id = groupId + deskNum;

    if (!this.selectedDate) {
      return 'booked';
    }

    const bookedDesk = this.bookings.find(
      (booking) =>
        booking.deskId === id && this.sameDay(booking.date, this.selectedDate),
    );

    if (bookedDesk) {
      return bookedDesk.user === this.currentUser ? 'mine' : 'booked';
    }

    if (this.selectedDesk === id) {
      return 'selected';
    }

    return 'available';
  }

  toggleDesk(groupId: string, deskNum: number) {
    if (!this.selectedDate) {
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
