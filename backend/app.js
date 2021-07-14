const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');
const app = express();

dotenv.config();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
}, []);



mongoose.connect(process.env.MONGO_URL, {

    useUnifiedTopology: true,

    useNewUrlParser: true,

    useCreateIndex: true,

    useFindAndModify: false

})
    .then(console.log("Assalamualaikum Boss, your app is connected to MongoDB"))
    .catch(err => console.log(err));

app.use("/api/pins", pinRoute)
app.use("/api/users", userRoute)
app.listen(5000, () => {
    console.log("Backend Server is running on port 5000");
});