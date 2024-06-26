// pages/api/getCurrency.js
import fetch from 'node-fetch';
import moment from 'moment-timezone';

const cachedData = { value: null, lastFetchTime: null };

export default async function handler(req, res) {
    if (!cachedData.value || !cachedData.lastFetchTime || (new Date() - cachedData.lastFetchTime > 30 * 60 * 1000)) {
        console.log("Attempting to fetch currency data...");
        try {
            const formattedDate = moment().add(1, "days").format("YYYY-MM-DDTHH:mm:ss");
            const url = `https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json/?date=${formattedDate}`;
            const response = await fetch(url);
            const data = await response.json();
            cachedData.value = data;
            cachedData.lastFetchTime = new Date();
            console.log("Currency data successfully fetched and cached.");
            res.status(200).json(cachedData.value);
        } catch (error) {
            console.error("Error fetching currency data:", error);
            res.status(503).send("Currency data is not available yet. Please try again later.");
        }
    } else {
        console.log("Returning cached currency data.");
        res.status(200).json(cachedData.value);
    }
}
