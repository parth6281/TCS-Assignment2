// import necessary modules
const axios = require('axios'); // for making HTTP requests
const API_URL = `http://localhost:5000` // API endpoint URL
const { TIMEOUT } = require('../config'); // import timeout value from config
const util = require('util') // utility module to convert callback based async code to promise based code
const db = require('../db'); // database module

const sleep = util.promisify(setTimeout); // promisify the setTimeout function
const cities = ["Toronto", "Windsor", "London"]; // array of cities to test
const city = "Kitchener".toUpperCase(); // test city name in uppercase
const badCity = "534".toUpperCase(); // test bad city.

// describe block for testing whether the API returns weather data for a given city
describe('Testing api to check whether it returns Weather data for a city', () => {
    // loop through the array of cities and run the test for each city
    cities.forEach(city => {
        test(`Test API for city: ${city}`, async () => {
            const response = await axios.get(`${API_URL}?city=${city}`) // make an HTTP GET request to the API endpoint with the city name as a query parameter
            expect(response.data.location).not.toBeUndefined(); // expect the response to contain a "location" key with a defined value
        })
    })
})

// test block for checking whether the API returns an error message if no city is passed
test('Testing api to check it replies with the error if city is not passed.', async () => {
    try {
        await axios.get(`${API_URL}`) // make an HTTP GET request to the API endpoint without a city name query parameter
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
});

// test block for checking whether the API returns an error message if invalid city name passed
test('Testing api to check it replies with the error if city is not passed.', async () => {
    try {
        await axios.get(`${API_URL}?city=${badCity}`) // make an HTTP GET request to the API endpoint without a city name query parameter
    } catch (error) {
        err = {
            status: error.response.status,
            message: error.response.data.message
        };
        expect(err).toEqual({
            status: 400,
            message: "Pass a valid City."
        });
    }
});

// test block for checking whether the city information is deleted from the database after a certain amount of time
test(`Testing api to check whether after ${TIMEOUT / 1000} seconds the city information is deleted from Database`,
    async () => {
        try {
            const collection = (await db.connect()).collection('weatherdata'); // connect to the database and get the collection object
            await collection.deleteOne({ city }); // delete the document for the test city from the collection

            await axios(`${API_URL}?city=${city}`); // make an HTTP GET request to the API endpoint with the test city name as a query parameter

            let data = await collection.findOne({ city }); // get the document for the test city from the collection
            expect(data).not.toBeNull(); // expect the document to exist in the collection

            await sleep(TIMEOUT + 500); // wait for the timeout value plus an additional 500 milliseconds

            data = await collection.findOne({ city }); // get the document for the test city from the collection
            expect(data).toBeNull(); // expect the document to not exist in the collection after the timeout period

        } catch (error) {
            console.error(error);
        } finally {
            db.disconnect(); // disconnect from the database
        }
    }
    , TIMEOUT + 2000);
