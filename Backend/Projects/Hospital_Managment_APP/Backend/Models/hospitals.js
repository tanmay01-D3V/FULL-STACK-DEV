const mongodb = require("../Config/db");

class Hospital {
    static async nextId() {
        const counter = await mongodb.db.collection("counters").findOneAndUpdate(
            { _id: "hospitalId" },
            { $inc: { seq: 1 } },
            { returnDocument: "after", upsert: true }
        );
        return counter.seq;
    }

    static async findAll() {
        const hospitals = await mongodb.db.collection("hospitals").find().toArray();
        if (!hospitals) {
            throw new Error("Something went wrong while fetching hospitals");
        }
        return hospitals;
    }

    static async findById(id) {
        const hospital = await mongodb.db.collection("hospitals").findOne({ _id: Number(id) });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        return hospital;
    }

    static async create(hospital) {
        hospital._id = await this.nextId();
        const result = await mongodb.db.collection("hospitals").insertOne(hospital);
        if (!result.acknowledged) {
            throw new Error("Something went wrong while creating hospital");
        }
        return hospital;
    }

    static async findByIdAndUpdate(id, hospitals) {
        const result = await mongodb.db.collection("hospitals").findOneAndUpdate(
            { _id: Number(id) },
            { $set: hospitals },
            { returnDocument: "after" }
        );
        if (!result) {
            throw new Error("Hospital not found");
        }
        return result;
    }

    static async findByIdAndDelete(id) {
        const result = await mongodb.db.collection("hospitals").findOneAndDelete({ _id: Number(id) });
        if (!result) {
            throw new Error("Hospital not found");
        }
        return result;
    }
}

module.exports = Hospital;
