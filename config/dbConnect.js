const {default: mongoose} = require("mongoose");
const dbConnect = () =>{
try {
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log("Database CONNECTED");
} catch (error) {
        console.log("Database ERROR");
}
};

module.exports = dbConnect;