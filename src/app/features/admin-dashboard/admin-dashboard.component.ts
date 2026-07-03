import { Component, signal } from '@angular/core';
import { Booking } from '../../core/models/booking';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  bookings = signal<Booking[]>([]);
  editingBooking = signal<Booking | null>(null);
  creating = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  officeGroups = ['A', 'B', 'C', 'D'];
  deskNumbers = [1, 2, 3, 4];

  selectedGroup = signal<string>('A');
  selectedNumber = signal<number>(1);

  users = ['Alice', 'Bob', 'Charlie', 'Admin'];
  allUsers: string[] = [];
  userSearch: string = '';

  todayString = new Date().toISOString().split('T')[0];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.bookingService.bookings$.subscribe((b) => {
      const sorted = [...b].sort((a, b) => a.date.getTime() - b.date.getTime());
      this.bookings.set(sorted);
    });

    this.bookingService.loadBookings();

    // load existing users for selector
    const users = this.authService.getAllUsers();
    this.allUsers = users.map((u) => u.fullName);
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
    this.userSearch = '';
    this.errorMessage.set(null);
  }

  startEdit(booking: Booking) {
    this.creating.set(false);
    this.editingBooking.set({ ...booking });

    // deskId format is like "A1" (group + number). Parse safely.
    const group = booking.deskId.charAt(0) || 'A';
    const number = Number(booking.deskId.slice(1)) || 1;
    this.selectedGroup.set(group);
    this.selectedNumber.set(number);
    this.userSearch = booking.user || '';
    this.errorMessage.set(null);
  }

  cancelEdit() {
    this.editingBooking.set(null);
    this.errorMessage.set(null);
  }

  saveBooking() {
    const b = this.editingBooking();
    if (!b) return;

    if (this.creating()) {
      // CREATE - prevent double-booking same desk/date
      if (this.isCollision(b)) {
        this.errorMessage.set(
          `Desk ${b.deskId} is already booked on ${b.date.toDateString()}`,
        );
        return;
      }

      this.bookingService.addBooking(b).subscribe(() => {
        const sorted = [...this.bookings()].sort(
          (a, b) => a.date.getTime() - b.date.getTime(),
        );
        this.bookings.set(sorted);
        this.editingBooking.set(null);
        this.errorMessage.set(null);
      });
    } else {
      // UPDATE - prevent collision with other bookings
      if (this.isCollision(b, b.id)) {
        this.errorMessage.set(
          `Desk ${b.deskId} is already booked on ${b.date.toDateString()}`,
        );
        return;
      }

      this.bookingService.updateBooking(b).subscribe(() => {
        const sorted = [...this.bookings()].sort(
          (a, b) => a.date.getTime() - b.date.getTime(),
        );
        this.bookings.set(sorted);
        this.editingBooking.set(null);
        this.errorMessage.set(null);
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
      // Keep deskId consistent as e.g. "A1" (no hyphen)
      booking.deskId = `${this.selectedGroup()}${this.selectedNumber()}`;
      this.editingBooking.set({ ...booking });
    }
  }

  // Validate before creating/updating to prevent double-booking same desk/date
  private isCollision(booking: Booking, excludeId?: string) {
    return this.bookings().some(
      (b) =>
        b.deskId === booking.deskId &&
        b.date.toDateString() === booking.date.toDateString() &&
        b.id !== excludeId,
    );
  }
}
