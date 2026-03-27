import { Injectable } from '@angular/core';

export interface Booking {
  user: string;
  deskId: string;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  selectedDesk: string | null = null;
  selectedDate: Date | null = null;
  selectedDateValid = true;
  bookings: Booking[] = [];

  // test = {
  //   project: 'STD',
  //   tabel_name: 'TRUCKS_TABLE',
  //   operation: 'READ',
  //   columns: ['ALL'],
  //   // filter: [{
  //   //   AND: [{
  //   //     PLANT_CODE: '1234'
  //   //   }]
  //   // }]
  // };

  // test2 = {
  //   project: 'STD',
  //   tabel_name: 'TRUCKS_TABLE',
  //   operation: 'CREATE',
  //   data: [
  //     {
  //       id_booking: '1',
  //       user_name: 'nume',
  //       booking_date: 'mm/dd/yy',
  //       booking_desk: 'A2',
  //     },
  //   ],
  // };

  // test3 = {
  //   project: 'STD',
  //   tabel_name: 'TRUCKS_TABLE',
  //   operation: 'DELETE',
  //   filter: [
  //     {
  //       AND: [
  //         {
  //           id_booking: '1',
  //         },
  //       ],
  //     },
  //   ],
  // };

  // response = {
  //   success: true,
  //   payload: [
  //     {
  //       id: 'srting1',
  //       truck_name: 'asfs',
  //       example: 'fsdfds',
  //     },
  //   ],
  // };

  // response2 = {
  //   success: true,
  //   payload: [
  //     {
  //       id_booking: '1',
  //       user_name: 'nume',
  //       booking_desk: 'A2',
  //     },
  //   ],
  // };

  selectDesk(deskId: string | null) {
    this.selectedDesk = deskId;
  }

  selectDate(date: Date | null, valid: boolean = true) {
    this.selectedDate = date;
    this.selectedDateValid = valid;
  }

  addBooking(booking: Booking): boolean {
    const exists = this.bookings.find(
      (b) =>
        b.user === booking.user &&
        b.date.toDateString() === booking.date.toDateString(),
    );
    if (exists) {
      return false;
    }

    this.bookings = [...this.bookings, booking];

    if (this.selectedDesk === booking.deskId) {
      this.selectDesk(null);
    }

    return true;
  }

  removeBooking(user: string, date: Date) {
    const bookingToRemove = this.bookings.find(
      (b) => b.user === user && b.date.toDateString() === date.toDateString(),
    );

    this.bookings = this.bookings.filter(
      (b) =>
        !(b.user === user && b.date.toDateString() === date.toDateString()),
    );

    if (bookingToRemove && this.selectedDesk === bookingToRemove.deskId) {
      this.selectDesk(null);
    }
  }

  getBookingFor(user: string, date: Date): Booking | undefined {
    return this.bookings.find(
      (b) => b.user === user && b.date.toDateString() === date.toDateString(),
    );
  }
}
