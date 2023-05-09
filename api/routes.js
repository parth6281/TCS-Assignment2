// Importing required dependencies
const axios = require('axios');
const { connect } = require('../db');
const { API_URL, TIMEOUT } = require('../config');

// Defining the function to fetch weather data
const getWeather = async (req, res) => {
    let city = req.query.city;

    // Checking if the city parameter is present in the query string
    if (!city) {
        res.status(400).json({
            message: "Pass a city name in the query string."
        });
        return;
    }

    // Removing leading/trailing whitespace and converting the city name to uppercase
    city = city.trim().toUpperCase();

    try {
        // Establishing a connection to the database
        const db = await connect();
        const collection = db.collection('weatherdata');

        // Searching the database for the weather data of the given city
        const data = await collection.findOne({ city });

        if (data) {
            // If the data is found in the database, returning it as the response
            const weather = data.data;
            res.json(weather);
        } else {
            // If the data is not found in the database, fetching it from the external API
            const url = `${API_URL}${city}`;
            const response = await axios.get(url);

            // Sending the response to the client
            res.status(200).json(response.data);

            // Inserting the fetched data into the database for future use
            collection.insertOne({
                city,
                data: response.data
            }).then(() => {
                // Deleting the data from the database after a set amount of time (specified by TIMEOUT)
                setTimeout(() => {
                    collection.deleteOne({ city });
                }, TIMEOUT)
            })
        }
    } catch (error) {
        // Handling errors
        console.error(error)
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
    }
}

module.exports = { getWeather };