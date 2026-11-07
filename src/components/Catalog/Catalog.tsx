"use client";
import { useState, type FormEvent } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  carsQuery,
  emptyFilters,
  nextPage,
  request,
  type CarsPage,
  type FilterMetadata,
  type Filters,
} from "../../lib/api";
import Image from "next/image";
import CarCard from "../CarCard/CarCard";
import styles from "./Catalog.module.css";
import common from "../../app/Common.module.css";

export default function Catalog() {
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [validation, setValidation] = useState("");
  const metadata = useQuery({
    queryKey: ["car-filters"],
    queryFn: ({ signal }) =>
      request<FilterMetadata>("/cars/filters", { signal }),
  });
  const cars = useInfiniteQuery({
    queryKey: ["cars", filters],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      request<CarsPage>(carsQuery(filters, pageParam), { signal }),
    getNextPageParam: nextPage,
  });
  const items = cars.data?.pages.flatMap((page) => page.cars) || [];
  const prices = metadata.data
    ? Array.from(
        {
          length:
            Math.floor(
              (metadata.data.price.max - metadata.data.price.min) / 10,
            ) + 1,
        },
        (_, i) => metadata.data!.price.min + i * 10,
      )
    : [];
  function update(key: keyof Filters, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setValidation("");
  }
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      draft.minMileage &&
      draft.maxMileage &&
      Number(draft.minMileage) > Number(draft.maxMileage)
    ) {
      setValidation("Minimum mileage must not exceed maximum mileage.");
      return;
    }
    setValidation("");
    setFilters({ ...draft });
  }
  function reset() {
    setDraft(emptyFilters);
    setFilters(emptyFilters);
    setValidation("");
  }
  return (
    <>
      <form className={styles.filters} onSubmit={search}>
        <label className={styles.filterField}>
          Car brand
          <select
            value={draft.brand}
            onChange={(e) => update("brand", e.target.value)}
            disabled={metadata.isPending}
          >
            <option value="">Choose a brand</option>
            {metadata.data?.brands.map((brand) => (
              <option key={brand}>{brand}</option>
            ))}
          </select>
        </label>
        <label className={styles.filterField + " " + styles.priceFilter}>
          Price / 1 hour
          <select
            value={draft.price}
            onChange={(e) => update("price", e.target.value)}
            disabled={metadata.isPending}
          >
            <option value="">Choose a price</option>
            {prices.map((price) => (
              <option value={price} key={price}>
                To ${price}
              </option>
            ))}
          </select>
        </label>
        <fieldset className={styles.mileageFilter}>
          <legend>Car mileage / km</legend>
          <div>
            <label>
              <span>From</span>
              <input
                aria-label="Minimum mileage"
                inputMode="numeric"
                type="number"
                min="0"
                step="1"
                value={draft.minMileage}
                onChange={(e) => update("minMileage", e.target.value)}
              />
            </label>
            <label>
              <span>To</span>
              <input
                aria-label="Maximum mileage"
                inputMode="numeric"
                type="number"
                min="0"
                step="1"
                value={draft.maxMileage}
                onChange={(e) => update("maxMileage", e.target.value)}
              />
            </label>
          </div>
        </fieldset>
        <div className={styles.filterActions}>
          <button className={styles.searchButton} type="submit">
            Search
          </button>
          {(Object.values(draft).some(Boolean) ||
            Object.values(filters).some(Boolean)) && (
            <button
              className={styles.clearFilters}
              type="button"
              onClick={reset}
            >
              Clear filters
            </button>
          )}
        </div>
      </form>
      {validation && (
        <p className={common.formError} role="alert">
          {validation}
        </p>
      )}
      {metadata.isError && (
        <p className={common.formError} role="alert">
          Could not load filter options.{" "}
          <button
            className={common.textButton}
            onClick={() => metadata.refetch()}
          >
            Try again
          </button>
        </p>
      )}
      {Object.values(filters).some(Boolean) && (
        <div className={styles.resultBar}>
          <span>
            {cars.data
              ? `${cars.data.pages[0].totalCars} cars found`
              : "Searching…"}
          </span>
        </div>
      )}
      {cars.isPending ? (
        <div
          className={styles.carGrid}
          aria-label="Loading cars"
          aria-busy="true"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div />
              <span />
              <span />
            </div>
          ))}
        </div>
      ) : items.length ? (
        <div className={styles.carGrid}>
          {items.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        !cars.isError && (
          <div className={common.emptyState}>
            <Image
              src="/no-cars.jpg"
              alt=""
              width={160}
              height={160}
              className={styles.emptyStateImage}
            />

            <h2>No cars found</h2>
            <p>Try another brand, price or mileage range.</p>
            <button className={common.button} onClick={reset}>
              Reset filters
            </button>
          </div>
        )
      )}
      {cars.isError && (
        <div className={common.errorState} role="alert">
          <p>{cars.error.message}</p>
          <button
            className={common.button}
            onClick={() =>
              cars.isFetchNextPageError ? cars.fetchNextPage() : cars.refetch()
            }
          >
            Try again
          </button>
        </div>
      )}
      {cars.hasNextPage && !cars.isFetchNextPageError && (
        <div className={styles.loadMore}>
          <button
            className={common.button + " " + common.outline}
            disabled={cars.isFetchingNextPage}
            onClick={() => cars.fetchNextPage()}
          >
            {cars.isFetchingNextPage ? (
              <>
                <span className={common.spinner} />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
      <p className={common.srOnly} role="status" aria-live="polite">
        {cars.isPending ? "Loading cars" : `${items.length} cars loaded`}
      </p>
    </>
  );
}
