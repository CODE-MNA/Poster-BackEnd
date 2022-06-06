const mongoose = require('mongoose')

db = (connectionURI)=> {
    mongoose.connect(connectionURI).then(console.log("Connected.")).catch((err) => console.error(err));
}

module.exports = db;
