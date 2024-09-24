import Database from '../models/db.js';

class Collections {
    constructor() {
        this.db = new Database();
    }

    getCollections = async (req, res) => {
        try {
            // Fetch collections from the database
            const collections = await this.db.getCollections();
            res.json(collections);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };
}

export default Collections;
