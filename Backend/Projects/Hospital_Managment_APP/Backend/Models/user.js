const mongodb = require("../Config/db");

class userss {
    static async nextId() {
        const counter = await mongodb.db.collection("counters").findOneAndUpdate(
            { _id: "usersId" },
            { $inc: { seq: 1 } },
            { returnDocument: "after", upsert: true }
        );
        return counter.seq;
    }

    static async findAll() {
        const userss = await mongodb.db.collection("users").find().toArray();
        if (!userss) {
            throw new Error("Something went wrong while fetching userss");
        }
        return userss;
    }

    static async findById(id) {
        const users = await mongodb.db.collection("users").findOne({ _id: Number(id) });
        if (!users) {
            throw new Error("users not found");
        }
        return users;
    }

    static async findOne(query) {
        const users = await mongodb.db.collection("users").findOne(query);
        if (!users) {
            return null;
        }
        return users;
    }

    static async create(users) {
        users._id = await this.nextId();
        const result = await mongodb.db.collection("users").insertOne(users);
        if (!result.acknowledged) {
            throw new Error("Something went wrong while creating users");
        }
        return users;
    }

    static async findByIdAndUpdate(id, userss) {
        const result = await mongodb.db.collection("users").findOneAndUpdate(
            { _id: Number(id) },
            { $set: userss },
            { returnDocument: "after" }
        );
        if (!result) {
            throw new Error("users not found");
        }
        return result;
    }

    static async findByIdAndDelete(id) {
        const result = await mongodb.db.collection("users").findOneAndDelete({ _id: Number(id) });
        if (!result) {
            throw new Error("users not found");
        }
        return result;
    }
}

module.exports = userss;
