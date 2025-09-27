const express = require('express');


const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workouts');

//express app
const app = express();

//middleware
app.use(express.json()); //to be able to send json data

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
});


//routes
app.use('/api/workouts', workoutRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database successfully!");
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('Listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
