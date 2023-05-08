const axios = require('axios');
const { connect, disconnect } = require('../db');
const { API_URL, TIMEOUT } = require('../config');

const getWeather = async (req, res) => {
    let city = req.query.city;

    if (!city) {
        res.status(400).json({
            message: "Pass a city name in the query string."
        });
        return;
    }
    city = city.trim().toUpperCase();

    try {
        const db = await connect();
        const collection = db.collection('weatherdata');
        const data = await collection.findOne({ city });
        if (data) {
            const weather = data.data;
            res.json(weather);
        } else {
            const url = `${API_URL}${city}`;
            const response = await axios.get(url);

            res.status(200).json(response.data);

            collection.insertOne({
                city,
                data: response.data
            }).then(() => {
                setTimeout(() => {
                    collection.deleteOne({ city });
                }, TIMEOUT)
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
    }
}

module.exports = { getWeather };