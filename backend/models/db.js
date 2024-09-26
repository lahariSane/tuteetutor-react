import mongoose from 'mongoose';
import dotenv from 'dotenv';
const dbName = 'TuteeTutor';

dotenv.config();

class Database {
    constructor() {
        this.uri = `${process.env.DATABASE}`;
        this.connection = null;
    }
    async connect() {
        try {
            await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Database connected");
            this.connection = mongoose.connection;
        } catch (error) {
            console.log(`Error: ${error.message}`);
            process.exit(1);
        }
    }

    async getCollections() {
        try {
            var collections = await mongoose.connection.client.db(dbName).listCollections().toArray();
            return collections;
        }
        catch (error) {
            console.log(`Error: ${error.message}`);
            throw error;
        }
    }

    async getCollectionByName(name) {
        try {
            var collection = await mongoose.connection.client.db(dbName).listCollections({ name: name }).toArray();
            return collection;
        }
        catch (error) {
            console.log(`Error: ${error.message}`);
            throw error;
        }
    }
}

export default Database;