const axios = require('axios');
const API_URL = `http://localhost:5000`
const { TIMEOUT } = require('../config');
const util = require('util')
const db = require('../db');

const sleep = util.promisify(setTimeout);
const cities = ["Toronto", "Windsor", "London"];
const city = "Kitchener".toUpperCase();

describe('Testing api to check whether it returns Weather data for a city', () => {
    cities.forEach(city => {
        test(`Test API for city: ${city}`, async () => {
            const response = await axios.get(`${API_URL}?city=${city}`)
            expect(response.data.location).not.toBeUndefined();
        })
    })
})

test('Testing api to check it replies with the error if city is not passed.', async () => {
    try {
        await axios.get(`${API_URL}`)
    } catch (error) {
        err = {
            status: error.response.status,
            message: error.response.data.message
        };
        expect(err).toEqual({
            status: 400,
            message: "Pass a city name in the query string."
        });
    }
})

test(`Testing api to check whether after ${TIMEOUT / 1000} seconds the city information is deleted from Database`, async () => {
    try {
        const collection = (await db.connect()).collection('weatherdata');
        await collection.deleteOne({ city });

        await axios(`${API_URL}?city=${city}`);

        let data = await collection.findOne({ city });

        expect(data).not.toBeNull();

        await sleep(TIMEOUT + 500);

        data = await collection.findOne({ city });
        expect(data).toBeNull();

    } catch (error) {
        console.error(error);
    } finally {
        db.disconnect();
    }
}, TIMEOUT + 2000);


