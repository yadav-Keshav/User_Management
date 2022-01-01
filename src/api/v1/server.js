const connectDB = require('./config/connectDB');
const app = require('./app');
const { PORT } = require('./config/env');


// Handling uncaught Error
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    process.exit(1);
})


//Connecting to Database
connectDB();

const server=app.listen(PORT, () => {
    console.log(`Server is Listening on PORT : ${process.env.PORT}`);
});


//Handling Unhandled Rejection
process.on('unhandledRejection',(err)=>{
    console.log(`Server is Closed Due to ${err.message}`);
    server.close();
    process.exit(1);
})

