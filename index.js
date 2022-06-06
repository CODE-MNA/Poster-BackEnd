const express = require('express');
const app = express();
const db = require('./config/db')


//Importing Routes
const userRoute = require('./routes/User');
const authRoute = require('./routes/Auth');

require('dotenv').config();

db(process.env.DB_PATH);

const PORT = process.env.PORT || 8000;

//Middlewares
app.use(express.json());

//Using routes
app.use('/users',userRoute);
app.use('/auth',authRoute);


app.listen(PORT,()=>{
    console.log("Server started at : http://localhost:" + PORT )
})