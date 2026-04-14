import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  tap,
  map,
  catchError,
} from 'rxjs';
import { of } from 'rxjs';

export interface Booking {
  id: string;
  user: string;
  deskId: string;
  date: Date;
}

export interface Notification {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export interface ValidationStatus {
  valid: boolean;
  message: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private selectedDeskSubject = new BehaviorSubject<string | null>(null);
  public selectedDesk$ = this.selectedDeskSubject.asObservable();

  private selectedDateSubject = new BehaviorSubject<Date | null>(null);
  public selectedDate$ = this.selectedDateSubject.asObservable();

  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  private userSubject = new BehaviorSubject<string>('Jhon Doe');
  public user$ = this.userSubject.asObservable();

  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  private validationSubject = new BehaviorSubject<ValidationStatus>({
    valid: true,
    message: null,
  });
  public validation$ = this.validationSubject.asObservable();

  get bookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  get selectedDesk(): string | null {
    return this.selectedDeskSubject.value;
  }

  get user(): string {
    return this.userSubject.value;
  }

  get selectedDate(): Date | null {
    return this.selectedDateSubject.value;
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
        catchError((error) => {
          this.notificationSubject.next({
            type: 'error',
            message: 'Failed to load bookings',
          });
          return of([]);
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
    this.selectedDeskSubject.next(deskId);
  }

  selectDate(date: Date | null) {
    this.selectedDateSubject.next(date);
  }

  setUser(name: string) {
    this.userSubject.next(name);
  }

  setValidation(validation: ValidationStatus) {
    this.validationSubject.next(validation);
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

          if (this.selectedDeskSubject.value === booking.deskId) {
            this.selectDesk(null);
          }

          this.notificationSubject.next({
            type: 'success',
            message: `Desk ${booking.deskId} booked successfully`,
          });
        } else {
          this.notificationSubject.next({
            type: 'error',
            message: 'Failed to book desk',
          });
        }
      }),
      catchError((error) => {
        this.notificationSubject.next({
          type: 'error',
          message: 'Failed to book desk',
        });
        return of(false);
      }),
      map((response: any) => response.success),
    );
  }

  removeBooking(user: string, date: Date): Observable<boolean> {
    const bookingToRemove = this.bookings.find(
      (b) => b.user === user && b.date.toDateString() === date.toDateString(),
    );

    if (!bookingToRemove) {
      this.notificationSubject.next({
        type: 'warning',
        message: 'No booking found to remove',
      });
      return of(false);
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

          if (this.selectedDeskSubject.value === bookingToRemove.deskId) {
            this.selectDesk(null);
          }

          this.notificationSubject.next({
            type: 'success',
            message: `Booking for desk ${bookingToRemove.deskId} withdrawn`,
          });
        } else {
          this.notificationSubject.next({
            type: 'error',
            message: 'Failed to withdraw booking',
          });
        }
      }),
      catchError((error) => {
        this.notificationSubject.next({
          type: 'error',
          message: 'Failed to withdraw booking',
        });
        return of(false);
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
