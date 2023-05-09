// Export an object with several properties, specifying configuration options for the application
module.exports = {
    // The URL of the MongoDB server
    DB_URL: 'mongodb://localhost:27017/',
    // The name of the database to use within the MongoDB server
    DB: 'weather',
    // The URL of the weather API, including a key and a query parameter that will be replaced with the requested location
    API_URL: 'http://api.weatherapi.com/v1/current.json?key=38be14083f2b4d0d83962740230705&q=',
    // Timeout for the entry to be deleted from the Database
    TIMEOUT: 20000
};
