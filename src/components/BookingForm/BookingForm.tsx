"use client";

import common from "../../app/Common.module.css";
import styles from "./BookingForm.module.css";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState, type FormEvent } from "react";
import { bookingPayload, request } from "@/src/lib/api";

const fieldNames = ["name", "email", "date", "comment"] as const;
type FieldName = (typeof fieldNames)[number];
type FieldErrors = Partial<Record<FieldName, string>>;
const labels: Record<FieldName, string> = {
  name: "Name*",
  email: "Email*",
  date: "Booking date*",
  comment: "Comment",
};

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function validateField(field: FieldName, rawValue: string): string | undefined {
  const value = rawValue.trim();
  switch (field) {
    case "name":
      if (
        !/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(
          value.replace(/\s+/g, " "),
        )
      ) {
        return "Please enter your name.";
      }
      if (value.length > 100) return "Name must be 100 characters or fewer.";
      break;
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Please enter your email.";
      if (value.length > 254) return "Email must be 254 characters or fewer.";
      break;
    case "date":
      if (!value) return "Please select a booking date.";
      if (value < localDate()) return "Please select today or a future date.";
      break;
    case "comment":
      if (!value) return "Comment is required";
      if (value.length > 2000)
        return "Comment must be 2000 characters or fewer.";
      break;
  }
}

export default function BookingForm({ carId }: { carId: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);
  const booking = useMutation({
    mutationFn: (body: ReturnType<typeof bookingPayload>) =>
      request<{ message: string }>(
        `/cars/${encodeURIComponent(carId)}/booking-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      ),
    onSuccess: (data) => {
      setSuccess(data.message);
      form.current?.reset();
      setErrors({});
      setTouched({});
      setSubmitted(false);
    },
  });

  function check(field: FieldName, value: string) {
    setErrors((previous) => ({
      ...previous,
      [field]: validateField(field, value),
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (booking.isPending) return;
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      fieldNames.map((field) => [field, String(data.get(field) || "")]),
    ) as Record<FieldName, string>;
    const nextErrors: FieldErrors = {};
    fieldNames.forEach((field) => {
      const message = validateField(field, values[field]);
      if (message) nextErrors[field] = message;
    });
    setSubmitted(true);
    setErrors(nextErrors);
    setSuccess("");
    booking.reset();
    const firstInvalidField = fieldNames.find((field) => nextErrors[field]);
    if (firstInvalidField) {
      const control = form.current?.elements.namedItem(firstInvalidField);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    booking.mutate(
      bookingPayload(values.name, values.email, values.date, values.comment),
    );
  }

  return (
    <section className={styles.booking}>
      <h2>Book your car now</h2>
      <p>Stay connected! We are always ready to help you.</p>
      <form
        ref={form}
        onSubmit={submit}
        noValidate
        aria-busy={booking.isPending}
      >
        {fieldNames.map((field) => {
          const error = errors[field];
          const id = `booking-${field}`;
          const controlProps = {
            id,
            name: field,
            required: true,
            disabled: booking.isPending,
            "aria-invalid": Boolean(error),
            "aria-describedby": error ? `${id}-error` : undefined,
            onBlur: (
              event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => {
              setTouched((previous) => ({ ...previous, [field]: true }));
              check(field, event.currentTarget.value);
            },
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => {
              const control = event.currentTarget;
              if (submitted || touched[field]) check(field, control.value);
              if (field === "date" && control.value && control.validity.valid) {
                control.blur();
              }
            },
            className: `${styles.control} ${field === "date" ? styles.dateControl : ""} ${error ? styles.controlInvalid : ""}`,
          };
          return (
            <div className={styles.field} key={field}>
              <div className={styles.controlWrap}>
                <label
                  htmlFor={id}
                  className={
                    error && field !== "comment"
                      ? styles.floatingLabel
                      : field === "date"
                        ? styles.dateLabel
                        : common.srOnly
                  }
                >
                  {labels[field]}
                </label>
                {field === "comment" ? (
                  <textarea
                    {...controlProps}
                    placeholder="Comment"
                    maxLength={2000}
                    rows={3}
                  />
                ) : (
                  <input
                    {...controlProps}
                    type={
                      field === "date"
                        ? "date"
                        : field === "email"
                          ? "email"
                          : "text"
                    }
                    placeholder={
                      field === "date" || error ? undefined : labels[field]
                    }
                    autoComplete={
                      field === "name"
                        ? "name"
                        : field === "email"
                          ? "email"
                          : undefined
                    }
                    maxLength={
                      field === "name"
                        ? 100
                        : field === "email"
                          ? 254
                          : undefined
                    }
                    min={field === "date" ? localDate() : undefined}
                  />
                )}

                {error && (
                  <img
                    src="/svg/error.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden="true"
                    className={`${styles.errorIcon} ${
                      field === "date" ? styles.dateErrorIcon : ""
                    }`}
                  />
                )}
              </div>
              {error && (
                <p
                  className={styles.fieldError}
                  id={`${id}-error`}
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
          );
        })}
        {booking.isError && (
          <p className={styles.serverError} role="alert">
            {booking.error.message}
          </p>
        )}
        <button
          type="submit"
          className={styles.sendButton}
          disabled={booking.isPending}
        >
          {booking.isPending ? (
            <>
              <span className={common.spinner} />
              Sending…
            </>
          ) : (
            "Send"
          )}
        </button>
      </form>
      {success && (
        <div className={styles.toast} role="status" aria-live="polite">
          <div>
            <strong>Booking request accepted!</strong>
            <p>{success}</p>
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}
    </section>
  );
}
