import { Component, signal } from '@angular/core';
import { Booking } from '../../core/models/booking';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  bookings = signal<Booking[]>([]);
  editingBooking = signal<Booking | null>(null);
  creating = signal<boolean>(false);

  officeGroups = ['A', 'B', 'C', 'D'];
  deskNumbers = [1, 2, 3, 4];

  selectedGroup = signal<string>('A');
  selectedNumber = signal<number>(1);

  users = ['Alice', 'Bob', 'Charlie', 'Admin'];

  todayString = new Date().toISOString().split('T')[0];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.bookings$.subscribe((b) => {
      const sorted = [...b].sort((a, b) => a.date.getTime() - b.date.getTime());
      this.bookings.set(sorted);
    });

    this.bookingService.loadBookings();
  }

  startCreate() {
    this.creating.set(true);
    this.selectedGroup.set('A');
    this.selectedNumber.set(1);

    this.editingBooking.set({
      id: '',
      user: '',
      deskId: 'A1',
      date: new Date(),
    });
  }

  startEdit(booking: Booking) {
    this.creating.set(false);
    this.editingBooking.set({ ...booking });

    const [group, number] = booking.deskId.split('');
    this.selectedGroup.set(group);
    this.selectedNumber.set(Number(number));
  }

  cancelEdit() {
    this.editingBooking.set(null);
  }

  saveBooking() {
    const b = this.editingBooking();
    if (!b) return;

    if (this.creating()) {
      // CREATE
      this.bookingService.addBooking(b).subscribe(() => {
        const sorted = [...this.bookings()].sort(
          (a, b) => a.date.getTime() - b.date.getTime(),
        );
        this.bookings.set(sorted);
        this.editingBooking.set(null);
      });
    } else {
      // UPDATE
      this.bookingService.updateBooking(b).subscribe(() => {
        const sorted = [...this.bookings()].sort(
          (a, b) => a.date.getTime() - b.date.getTime(),
        );
        this.bookings.set(sorted);
        this.editingBooking.set(null);
      });
    }
  }

  deleteBooking(booking: Booking) {
    this.bookingService
      .removeBooking(booking.user, booking.date)
      .subscribe(() => {
        const sorted = [...this.bookings()].sort(
          (a, b) => a.date.getTime() - b.date.getTime(),
        );
        this.bookings.set(sorted);
      });
  }

  updateDate(event: string) {
    const booking = this.editingBooking();
    if (booking) {
      booking.date = new Date(event);
      this.editingBooking.set({ ...booking });
    }
  }

  updateGroup(group: string) {
    this.selectedGroup.set(group);
    this.updateDeskId();
  }

  updateNumber(num: number) {
    this.selectedNumber.set(num);
    this.updateDeskId();
  }

  updateDeskId() {
    const booking = this.editingBooking();
    if (booking) {
      booking.deskId = `${this.selectedGroup()}-${this.selectedNumber()}`;
      this.editingBooking.set({ ...booking });
    }
  }
}
