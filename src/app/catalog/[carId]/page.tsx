import styles from "../CarDetails.module.css";
import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ApiError, request, mileage, type Car } from "@/src/lib/api";
import BookingForm from "../../../components/BookingForm/BookingForm";
const getCar = cache(async (id: string) => {
  try {
    return await request<Car>(`/cars/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 404 || error.status === 400)
    )
      notFound();
    throw error;
  }
});
type Props = { params: Promise<{ carId: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = await getCar((await params).carId);
  return {
    title: `${car.brand} ${car.model}, ${car.year}`,
    description: car.description,
    openGraph: {
      title: `${car.brand} ${car.model} — RentalCar`,
      description: car.description,
      images: [{ url: car.img, alt: `${car.brand} ${car.model}` }],
    },
  };
}
export default async function CarDetails({ params }: Props) {
  const car = await getCar((await params).carId);
  return (
    <main id="main" className={styles.page}>
      <div className={styles.details}>
        <div className={styles.detailLeft}>
          <img
            className={styles.detailImage}
            src={car.img}
            alt={`${car.brand} ${car.model}, ${car.year}`}
            fetchPriority="high"
          />
          <BookingForm carId={car.id} />
        </div>
        <article className={styles.detailInfo}>
          <div className={styles.detailHeading}>
            <h1>
              {car.brand} {car.model}, {car.year}
            </h1>
            <span>Article: {car.stockNumber || car.id.slice(0, 8)}</span>
          </div>
          <div className={styles.detailLocation}>
            <img
              src="/svg/location.svg"
              alt=""
              width={16}
              height={16}
              className={styles.icon}
            />
            <span>
              {car.location.city}, {car.location.country}
            </span>
          </div>
          <p className={styles.detailPrice}>${car.rentalPrice}</p>
          <p className={styles.description}>{car.description}</p>
          <section className={styles.detailSection}>
            <h2>Rental Conditions:</h2>
            <ul>
              {car.rentalConditions.map((condition) => (
                <li key={condition}>
                  {" "}
                  <img
                    src="/svg/component.svg"
                    alt=""
                    width={16}
                    height={16}
                    className={styles.icon}
                  />
                  {condition}
                </li>
              ))}
            </ul>
          </section>
          <section className={styles.detailSection}>
            <h2>Car Specifications:</h2>
            <ul>
              <li>
                {" "}
                <img
                  src="/svg/year.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.icon}
                />
                Year: {car.year}
              </li>
              <li>
                {" "}
                <img
                  src="/svg/type.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.icon}
                />
                Type: {car.type}
              </li>
              <li>
                {" "}
                <img
                  src="/svg/fuel.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.icon}
                />
                Fuel Consumption: {car.fuelConsumption} L/100 km
              </li>
              <li>
                {" "}
                <img
                  src="/svg/engine.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.icon}
                />
                Engine: {car.engine}
              </li>
              <li>
                {" "}
                <img
                  src="/svg/mileage.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.icon}
                />
                Mileage: {mileage(car.mileage)} km
              </li>
            </ul>
          </section>
          <section className={styles.detailSection}>
            <h2>Features</h2>
            <ul>
              {car.features.map((feature) => (
                <li key={feature}>
                  {" "}
                  <img
                    src="/svg/component.svg"
                    alt=""
                    width={16}
                    height={16}
                    className={styles.icon}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
          <section className={styles.detailSection}>
            <h2>Rental company:</h2>
            <p>{car.rentalCompany}</p>
            <p>
              {car.location.address}, {car.location.city},{" "}
              {car.location.country}
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
