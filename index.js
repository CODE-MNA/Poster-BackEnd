const express = require('express');
const app = express();
const db = require('./config/db')
const cors = require('cors')

//Importing Routes
const userRoute = require('./routes/User');
const authRoute = require('./routes/Auth');
const { errorMiddleware } = require('./middlewares/errorhandling');

require('dotenv').config();

db(process.env.DB_PATH);

const PORT = process.env.PORT || 8000;

//Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}))
app.use(express.json());

//Using routes
app.use('/users',userRoute);
app.use('/auth',authRoute);

app.get('/ping',(req, res,next) => {
    try{

        res.status(200).send({pong: true});
    }catch(err){
        res.status(404).send({pong: false});
    }
})

//Using error middlewares
app.use(errorMiddleware)


app.listen(PORT,()=>{
    console.log("Server started at : "+  PORT )
})