import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useHAnalytics, AppScreen } from "@hedviginsurance/hanalytics-client";

export default function Home() {
  const { trackers, experiments } = useHAnalytics();

  return (
    <div className={styles.container}>
      <Head>
        <title>hAnalytics Example</title>
      </Head>

      <main className={styles.main}>
        <button onClick={() => trackers.appBackground()}>
          Click to send a tracking event
        </button>

        <p>Loaded experiment allowExternalDataCollection and got</p>
        {experiments.allowExternalDataCollection() ? "Allow" : "Disallow"}
      </main>
    </div>
  );
}
