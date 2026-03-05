import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnDestroy {
  officeGroups = ['A', 'B', 'C', 'D'];
  deskNumbers = [1, 2, 3, 4];

  deskStatusMap: { [key: string]: string } = {};

  private subs: Subscription = new Subscription();

  private currentDate: Date | null = null;
  private currentDateValid = true;
  private user = 'Vincze Norbert';

  private sameDay(a: Date | undefined, b: Date | null): boolean {
    if (!a || !b) return false;
    return a.toDateString() === b.toDateString();
  }

  constructor(private bookingService: BookingService) {
    this.subs.add(
      combineLatest([
        this.bookingService.selectedDate$,
        this.bookingService.selectedDateValid$,
      ]).subscribe(([date, valid]) => {
        this.currentDate = date;
        this.currentDateValid = valid;
        this.resetSelections();
        this.bookingService.selectDesk(null);
        this.markUserBooking();
      }),
    );

    this.subs.add(
      combineLatest([
        this.bookingService.bookings$,
        this.bookingService.selectedDate$,
        this.bookingService.selectedDateValid$,
      ]).subscribe(([bookings, date, valid]) => {
        for (const id in this.deskStatusMap) {
          if (
            this.deskStatusMap[id] === 'booked' ||
            this.deskStatusMap[id] === 'mine'
          ) {
            this.deskStatusMap[id] = 'available';
          }
        }
        if (!valid || !date) {
          for (const group of this.officeGroups) {
            for (const num of this.deskNumbers) {
              this.deskStatusMap[group + num] = 'booked';
            }
          }
        } else {
          bookings
            .filter((b) => this.sameDay(b.date, date))
            .forEach((b) => {
              this.deskStatusMap[b.deskId] = 'booked';
            });
        }
        this.markUserBooking();
      }),
    );
  }

  private markUserBooking() {
    if (!this.currentDate) {
      return;
    }
    const booking = this.bookingService.getBookingFor(
      this.user,
      this.currentDate,
    );
    if (booking) {
      this.deskStatusMap[booking.deskId] = 'mine';
    }
  }

  getStatus(groupId: string, deskNum: number): string {
    const id = groupId + deskNum;
    return this.deskStatusMap[id] || 'available';
  }

  toggleDesk(groupId: string, deskNum: number) {
    if (!this.currentDateValid) {
      return;
    }
    const id = groupId + deskNum;
    const currentStatus = this.getStatus(groupId, deskNum);

    if (currentStatus === 'available') {
      this.resetSelections();
      this.deskStatusMap[id] = 'selected';
      this.bookingService.selectDesk(id);
    } else if (currentStatus === 'selected') {
      this.deskStatusMap[id] = 'available';
      this.bookingService.selectDesk(null);
    }
  }

  resetSelections() {
    for (const deskId in this.deskStatusMap) {
      if (this.deskStatusMap[deskId] === 'selected') {
        this.deskStatusMap[deskId] = 'available';
      }
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
