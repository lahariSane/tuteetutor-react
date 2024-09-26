import Database from '../models/db.js';

class Collections {
    constructor() {
        this.db = new Database();
    }

    getCollections = async (req, res) => {
        try {
            const collections = await this.db.getCollections();
            res.json(collections);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };

    getCollection = async (req, res) => {
        try {
            const collectionName = req.params.collectionName;
            const collection = await this.db.getCollection(collectionName);
            res.json(collection);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default Collections;
