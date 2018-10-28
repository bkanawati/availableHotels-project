//Load our app using express..
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mysql = require('mysql');

app.use(morgan('combined'));

//mySql database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root@localhost',
    database: 'hotel_db'
});

// Just to check if my server is running..
app.get( '/', (req, res) => {
   res.send("Hello");
});


// A Get request to view the data stored in /bestHotel or /CrazyHotels...
app.get( '/:name', (req, res) => {
    let urlPath;
    if (req.params.name == 'bestHotel') {
        urlPath = 'best_hotel';
    } if (req.params.name == 'CrazyHotels') {
        urlPath = 'crazy_hotels';
    } 
    connection.query("SELECT * FROM " + urlPath, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for table: " + err);
            res.sendStatus(500);
            return;
        }
        console.log('I believe we fetched the table successfully..');
        res.json(rows);
    });
});

//Available API query function
let availableHotel = function (startDate, endDate, city, numberOfAdults) {
    return connection.query("SELECT  hotel_name, hotel_fare, room_amenities " +
                            "FROM crazy_hotels " +
                            "WHERE number_of_adults = " + numberOfAdults + " AND city = " + city + " " +
                            "ORDER BY LENGTH(hotel_rate); " +
                            "HAVING hotel_date BETWEEN " + startDate + " AND " + endDate + " " +
                            "UNION " +
                            "SELECT  hotel_name, hotel_fare, room_amenities " +
                            "FROM besT_hotel " +
                            "WHERE hotel_date BETWEEN " + startDate + " AND " + endDate + " " +
                            "ORDER BY hotel_rate; " +
                            "HAVING number_of_adults = " + numberOfAdults + " AND city = " + city + " " , (err, rows, fields) => {
            res.json(rows);
    });
};


app.listen(3000, () => { 
    console.log(`Listening on port 3000...`);
});