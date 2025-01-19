const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, );
        //the message that helps to display the connection of database
        console.log("Database Connected Successfully!!");
    } catch (error) {
        console.error("Database Connection Failed:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
