import { useState, useEffect } from "react";
import styles from "./App.module.css";

const API_KEY = "152e68e3546842b289d78601fdff3b36";

const API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;

function App() {
  const [currencies, setCurrencies] = useState({});

  const getPercentageValue = (numStr, percentage) => {
    const num = parseFloat(numStr);
    return (num * percentage) / 100;
  };

  const getPurchaseRate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) + percentage;
  };

  const getSellRate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) - percentage;
  };

  const formatApiData = (apiResult) => {
    const exchangeRates = apiResult.rates;
    const selectedCurrencies = ["CAD", "IDR", "JPY", "CHF", "EUR", "GBP"];
    
    const result = {
      curr: {
        title: "Currency",
        values: selectedCurrencies,
      },
      purchaseRate: {
        title: "We Buy",
        values: selectedCurrencies.map(
          (currency) => getPurchaseRate(exchangeRates[currency], getPercentageValue(exchangeRates[currency], 5)).toFixed(5)
        ),
      },
      exchangeRate: {
        title: "Exchange Rate",
        values: selectedCurrencies.map((currency) => parseFloat(exchangeRates[currency]).toFixed(5)),
      },
      sellRate: {
        title: "We Sell",
        values: selectedCurrencies.map(
          (currency) => getSellRate(exchangeRates[currency], getPercentageValue(exchangeRates[currency], 5)).toFixed(5)
        ),
      },
    };

    setCurrencies(result);
  };

  const fetchCurrencyData = async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        const respJson = await res.json();
        throw respJson;
      }

      const result = await res.json();
      formatApiData(result);
    } catch (error) {
      console.error("[fetchCurrencyData]:", error);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.container}>
        <div style={{ width: "100%" }}>
          <h1 style={{ color: "white", marginBottom: "10px" }}>{"Currency"}</h1>
          {currencies.curr?.values.map((currency, index) => (
            <div key={index}>
              <p style={{ marginBottom: "5px", color: "white" }}>{currency}</p>
            </div>
          ))}
        </div>
        <div style={{ width: "100%" }}>
          <h1 style={{ color: "white", marginBottom: "10px" }}>{"We Buy"}</h1>
          {currencies.purchaseRate?.values.map((rate, index) => (
            <div key={index}>
              <p style={{ marginBottom: "5px", color: "white" }}>{rate}</p>
            </div>
          ))}
        </div>
        <div style={{ width: "100%" }}>
          <h1 style={{ color: "white", marginBottom: "10px" }}>{"Exchange Rate"}</h1>
          {currencies.exchangeRate?.values.map((rate, index) => (
            <div key={index}>
              <p style={{ marginBottom: "5px", color: "white" }}>{rate}</p>
            </div>
          ))}
        </div>
        <div style={{ width: "100%" }}>
          <h1 style={{ color: "white", marginBottom: "10px" }}>{"We Sell"}</h1>
          {currencies.sellRate?.values.map((rate, index) => (
            <div key={index}>
              <p style={{ marginBottom: "5px", color: "white" }}>{rate}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;