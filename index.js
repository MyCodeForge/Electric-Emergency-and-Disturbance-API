// lets import our packages and initialize our variables
const express = require('express');
const { readFileSync } = require('fs');
const app = express();
const PORT = 8080;
const DOE_Electric_Disturbance_Events = readFileSync('data/DOE_Electric_Disturbance_Events.json');

// Use express.json middleware to parse all req.body as json
app.use( express.json() );

// time to create our first endpoint to return all the events
app.get('/events', (req, res) => {
    res.status(200).send( DOE_Electric_Disturbance_Events )
})

app.listen(
    PORT,
    () => console.log(`API is listening on http://localhost:${PORT}`)
)
