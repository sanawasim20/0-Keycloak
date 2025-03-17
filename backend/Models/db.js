// MongoDB Username: sanawasim5678 Password: AwwP37zkUqo4tHVt

import mongoose from "mongoose";



        import dotenv from "dotenv";

        dotenv.config(); // Ensure environment variables are loaded
        
        
        if (!process.env.MONGO_CONN) {
            console.error("MONGO_CONN is not defined! Check your .env file.");
            process.exit(1);
        }
        
        mongoose.connect(process.env.MONGO_CONN)
            .then(() => console.log('MongoDB Connected...'))
            .catch(err => console.error('Mongo Connection Error:', err));
