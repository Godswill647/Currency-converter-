
const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swap");
const result = document.getElementById("result");
const rate = document.getElementById("rate");
const status = document.getElementById("status");

async function convertCurrency() {

    const value = Number(amount.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (!Number.isFinite(value) || value <= 0) {
        status.textContent = "Please enter a valid amount.";
        return;
    }

    if (from === to) {
        result.textContent = value.toLocaleString(
            "en-US",
            { maximumFractionDigits: 2 }
        );
        rate.textContent = `1 ${from} = 1 ${to}`;
        status.textContent = "Conversion successful!";
        return;
    }

    status.textContent = "Converting...";
    convertBtn.disabled = true;
    convertBtn.textContent = "Please wait...";

    try {

        const response = await fetch(
            `https://open.er-api.com/v6/latest/${from}`
        );

        if (!response.ok) {
            throw new Error("Unable to get exchange rates.");
        }

        const data = await response.json();

        if (data.result !== "success" || !data.rates[to]) {
            throw new Error("Currency not supported.");
        }

        const exchangeRate = data.rates[to];
        const convertedAmount = value * exchangeRate;

        result.textContent = convertedAmount.toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        );

        rate.textContent =
            `1 ${from} = ${exchangeRate.toFixed(4)} ${to}`;

        status.textContent =
            `Last updated: ${data.time_last_update_utc}`;

    } catch (error) {

        status.textContent =
            "Conversion failed. Check your internet connection.";

    } finally {

        convertBtn.disabled = false;
        convertBtn.textContent = "Convert Currency";

    }
}

// Convert button
convertBtn.addEventListener("click", convertCurrency);

// Swap currencies
swapBtn.addEventListener("click", () => {

    const oldFrom = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = oldFrom;

    convertCurrency();

});

// Automatically convert when currencies change
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

// Convert when amount changes
amount.addEventListener("input", () => {
    if (amount.value && Number(amount.value) > 0) {
        convertCurrency();
    }
});

// Initial conversion
convertCurrency();
