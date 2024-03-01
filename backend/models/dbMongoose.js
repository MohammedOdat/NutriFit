const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI_MONGOOSE).then((result) => {
    console.log("DB Ready To Use");
}).catch((err) => {
    console.log(err);
});