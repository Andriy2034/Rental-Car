'use client';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState, type FormEvent } from 'react';
import { bookingPayload, request } from '../../lib/api';
import styles from './BookingForm.module.css';
function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
export default function BookingForm({ carId }: { carId: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [success, setSuccess] = useState('');
  const [dateError, setDateError] = useState('');
  const booking = useMutation({
    mutationFn: (body: ReturnType<typeof bookingPayload>) =>
      request<{ message: string }>(`/cars/${encodeURIComponent(carId)}/booking-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: (data) => {
      setSuccess(data.message);
      form.current?.reset();
    },
  });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (booking.isPending) return;
    const values = new FormData(event.currentTarget);
    const date = String(values.get('date'));
    if (date < localDate()) {
      setDateError('Please select today or a future date.');
      return;
    }
    setDateError('');
    setSuccess('');
    booking.mutate(
      bookingPayload(
        String(values.get('name')),
        String(values.get('email')),
        date,
        String(values.get('comment') || ''),
      ),
    );
  }
  return (
    <section className={styles.booking}>
      <h2>Book your car now</h2>
      <p>Stay connected! We are always ready to help you.</p>
      <form ref={form} onSubmit={submit}>
        <label className={styles.srOnly} htmlFor="booking-name">
          Name
        </label>
        <input
          id="booking-name"
          name="name"
          placeholder="Name*"
          autoComplete="name"
          required
          maxLength={100}
          pattern=".*\S.*"
        />
        <label className={styles.srOnly} htmlFor="booking-email">
          Email
        </label>
        <input
          id="booking-email"
          name="email"
          type="email"
          placeholder="Email*"
          autoComplete="email"
          maxLength={254}
          required
        />
        <label className={styles.dateField}>
          <span>Booking date*</span>
          <input name="date" type="date" aria-label="Booking date" min={localDate()} required />
        </label>
        <label className={styles.srOnly} htmlFor="booking-comment">
          Comment
        </label>
        <textarea
          id="booking-comment"
          name="comment"
          placeholder="Comment"
          maxLength={2000}
          rows={3}
        />
        {dateError && (
          <p className={styles.formError} role="alert">
            {dateError}
          </p>
        )}
        {booking.isError && (
          <p className={styles.formError} role="alert">
            {booking.error.message}
          </p>
        )}
        <button className={styles.button} disabled={booking.isPending}>
          {booking.isPending ? (
            <>
              <span className={styles.spinner} />
              Sending…
            </>
          ) : (
            'Send'
          )}
        </button>
      </form>
      {success && (
        <div className={styles.toast} role="status" aria-live="polite">
          <div>
            <strong>Booking request accepted!</strong>
            <p>{success}</p>
          </div>
          <button type="button" aria-label="Dismiss notification" onClick={() => setSuccess('')}>
          </button>
        </div>
      )}
    </section>
  );
}
