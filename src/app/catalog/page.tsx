import type { Metadata } from "next";
import Catalog from "@/src/components/Catalog/Catalog";
import styles from "@/src/components/Catalog/Catalog.module.css";
import common from "../Common.module.css";

export const metadata: Metadata = {
  title: "Car catalog",
  description:
    "Explore rental cars in Ukraine. Filter by brand, price and mileage to find your next journey.",
};

export default function CatalogPage() {
  return (
    <main id="main" className={`${common.container} ${styles.catalog}`}>
      <h1 className={common.srOnly}>Car catalog</h1>
      <Catalog />
    </main>
  );
}
