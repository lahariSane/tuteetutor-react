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

    getCollectionByName = async (req, res) => {
        try {
            const collection = await this.db.getCollectionByName(req.params.name);
            res.json(collection);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };

    updateLeaveRequestStatus = async (req, res) => {
        try {
            const { status } = req.body;
            const response = await this.db.updateLeaveRequestStatus(req.params.id, status);
            res.json(response);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };

    getFaculty = async (req, res) => {
        console.log(req.query);
        try {
            const role= req.query.role;
            console.log(role);
            const faculty = await this.db.getUsersByRole(role);
            console.log(faculty);
            res.json(faculty);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    deleteFaculty = async (req, res) => {
        try {
            const response = await this.db.deleteFaculty(req.params.id);
            res.json(response);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    deleteHod = async (req, res) => {
        try {
            const response = await this.db.deleteHod(req.params.id);
            res.json(response);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default Collections;
