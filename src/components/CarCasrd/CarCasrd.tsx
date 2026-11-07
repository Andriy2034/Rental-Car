'use client';
import { Car, mileage } from '../../lib/api';
import styles from './CarCasrd.module.css';
import common from '../../app/Common.module.css';

export default function CarCard({
  car,
  favorite,
  toggle,
}: {
  car: Car;
  favorite: boolean;
  toggle: () => void;
}) {
  return (
    <article className={styles.carCard}>
      <div className={styles.carImage}>
        <img src={car.img} alt={`${car.brand} ${car.model}, ${car.year}`} loading="lazy" />
        <button
          type="button"
          className={styles.favorite + (favorite ? ' ' + styles.isFavorite : '')}
          aria-label={`${favorite ? 'Remove' : 'Add'} ${car.brand} ${car.model} ${favorite ? 'from' : 'to'} favorites`}
          aria-pressed={favorite}
          onClick={toggle}
        >
        </button>
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
      <div className={styles.carMeta + ' ' + styles.second}>
        <span>{car.type}</span>
        <span>{mileage(car.mileage)} km</span>
      </div>
      <a
        className={`${common.button} ${styles.readMore}`}
        href={`/catalog/${car.id}`}
        rel="noopener noreferrer"
        aria-label={`Read more about ${car.brand} ${car.model} (opens in a new tab)`}
      >
        Read more
      </a>
    </article>
  );
}
