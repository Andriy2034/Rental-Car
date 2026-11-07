"use client";
import Image from "next/image";
import { Car, mileage } from "../../lib/api";
import styles from "./CarCard.module.css";
import common from "../../app/Common.module.css";

export default function CarCard({ car }: { car: Car }) {
  return (
    <article className={styles.carCard}>
      <div className={styles.carImage}>
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}, ${car.year}`}
          fill
          sizes="(max-width: 480px) calc(100vw - 32px), (max-width: 760px) 50vw, (max-width: 1100px) 33vw, 276px"
        />
      </div>
      <div className={styles.carTitle}>
        <h2>
          {car.brand} <span>{car.model}</span>, {car.year}
        </h2>
        <strong>${car.rentalPrice}</strong>
      </div>
      <div className={styles.carMeta}>
        <span>{car.location.city}</span>
        <span>{car.location.country}</span>
        <span>{car.rentalCompany}</span>
      </div>
      <div className={styles.carMeta + " " + styles.second}>
        <span>{car.type}</span>
        <span>{mileage(car.mileage)} km</span>
      </div>
      <a
        className={`${common.button} ${styles.readMore}`}
        href={`/catalog/${car.id}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Read more about ${car.brand} ${car.model} (opens in a new tab)`}
      >
        Read more
      </a>
    </article>
  );
}
