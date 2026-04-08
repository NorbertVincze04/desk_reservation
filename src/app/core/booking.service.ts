import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';

export interface Booking {
  id: string;
  user: string;
  deskId: string;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  selectedDesk: string | null = null;
  private selectedDateSubject = new BehaviorSubject<Date | null>(null);
  public selectedDate$ = this.selectedDateSubject.asObservable();
  selectedDate: Date | null = null;
  selectedDateValid = true;
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();
  public user = 'Jhon Doe';

  get bookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  private apiUrl = 'https://your-backend-api.com/api';

  constructor(private http: HttpClient) {
    this.loadBookings();
  }

  private loadBookings() {
    this.execute({ table_name: 'BOOKINGS_TABLE', operation: 'READ' })
      .pipe(
        map((response: any) => {
          if (response.success) {
            return response.payload.map((b: any) => ({
              id: b.id,
              user: b.user_name,
              deskId: b.booking_desk,
              date: new Date(b.booking_date),
            }));
          }
          return [];
        }),
      )
      .subscribe((bookings) => {
        this.bookingsSubject.next(bookings);
      });
  }

  execute(command: any): Observable<any> {
    return this.http.post(this.apiUrl, command);
  }

  selectDesk(deskId: string | null) {
    this.selectedDesk = deskId;
  }

  selectDate(date: Date | null, valid: boolean = true) {
    this.selectedDate = date;
    this.selectedDateValid = valid;
    this.selectedDateSubject.next(date);
  }

  addBooking(booking: Booking): Observable<boolean> {
    const command = {
      table_name: 'BOOKINGS_TABLE',
      operation: 'CREATE',
      data: {
        user_name: booking.user,
        booking_date: booking.date.toLocaleDateString(),
        booking_desk: booking.deskId,
      },
    };

    return this.execute(command).pipe(
      tap((response: any) => {
        if (response.success) {
          const newBooking = {
            id: response.payload.id,
            user: booking.user,
            deskId: booking.deskId,
            date: booking.date,
          };
          this.bookingsSubject.next([...this.bookings, newBooking]);

          if (this.selectedDesk === booking.deskId) {
            this.selectDesk(null);
          }
        }
      }),
      map((response: any) => response.success),
    );
  }

  removeBooking(user: string, date: Date): Observable<boolean> {
    const bookingToRemove = this.bookings.find(
      (b) => b.user === user && b.date.toDateString() === date.toDateString(),
    );

    if (!bookingToRemove) {
      return new Observable((subscriber) => subscriber.next(false));
    }

    const command = {
      table_name: 'BOOKINGS_TABLE',
      operation: 'DELETE',
      data: { id: bookingToRemove.id },
    };

    return this.execute(command).pipe(
      tap((response: any) => {
        if (response.success) {
          this.bookingsSubject.next(
            this.bookings.filter((b) => b.id !== bookingToRemove.id),
          );

          if (this.selectedDesk === bookingToRemove.deskId) {
            this.selectDesk(null);
          }
        }
      }),
      map((response: any) => response.success),
    );
  }

  getBookingFor(user: string, date: Date): Booking | undefined {
    return this.bookings.find(
      (b) => b.user === user && b.date.toDateString() === date.toDateString(),
    );
  }
}
