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

    async getCollections(){
        try{
            console.log(await mongoose.connection.listDatabases());
            for(var database in await mongoose.connection.listDatabases()){
                if(database.name == dbName){
                    var collections = await mongoose.connection.database.listCollections().toArray();
                }
            }
            console.log(collections);
            return collections;
        }
        catch(error){
            console.log(`Error: ${error.message}`);
            throw error;
        }
    }
}

export default Database;