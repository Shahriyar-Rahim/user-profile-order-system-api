require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors());

// mongodb connetcion
const uri = process.env.MONGODB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // create database and collection
        const db = client.db('userprofile-system');

        // create schema for profile
        const userSchema = {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: "User profile schema validation",
                    required: ["name", "email", "age"],
                    properties: {
                        name: {
                            bsonType: "string",
                            description: "'name' must be a string and is required"
                        },
                        email: {
                            bsonType: "string",
                            description: "'email' must be a string and is required",
                            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
                        },
                        age: {
                            bsonType: "int",
                            minimum: 18,
                            description: "'age' must be a number and is required and must be greater than 18 years old",
                        },
                        address: {
                            bsonType: "object",
                            required: ["city", "country", "zip"],
                            properties: {
                                city: {
                                    bsonType: "string",
                                    description: "'city' must be a string and is required"
                                },
                                country: {
                                    bsonType: "string",
                                    description: "'country' must be a string and is required"
                                },
                                zip: {
                                    bsonType: "int",
                                    description: "'zip' must be a string and is required"
                                }
                            }
                        },
                        cratedAt: {
                            bsonType: "date",
                            description: "Auro generated date time"
                        }
                    }
                }
            }
        };

        const orderSchema = {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: "Order schema validation",
                    required: ["user_id", "items", "totalAmmount"],
                    properties: {
                        user_id: {
                            bsonType: "objectId",
                            description: "User reference id"
                        },
                        items: {
                            bsonType: "array",
                            required: ["product", "price"],
                            properties: {
                                product: {
                                    bsonType: "string",
                                    description: "'product' must be a string and is required"
                                },
                                price: {
                                    bsonType: "double",
                                    description: "'price' must be a number and is required"
                                }
                            }
                        },
                        totalAmmount: {
                            bsonType: "double",
                            description: "Total order price"
                        },
                        status: {
                            enum: ["pending", "shipped", "delivered"],
                            description: "Order status"
                        },
                        orderDate: {
                            bsonType: "date",
                            description: "Auto generated date time"
                        }
                    }
                }
            }
        };


        // db collections
        if (userSchema.length === 0 || orderSchema.length === 0) {
            console.log("User and order collections already exists");
        } else {
            await db.createCollection('users', userSchema);
            await db.createCollection('orders', orderSchema);
        }

        const userCollection = await db.collection("users");
        const orderCollection = await db.collection("orders");

        // indexing
        userCollection.createIndex({ email: 1 }, { unique: true });
        orderCollection.createIndex({ user_id: 1 });


        // post create user
        app.post('/users', async (req, res) => {
            try {
                const result = await userCollection.insertOne({
                    ...req.body,
                    cratedAt: new Date()
                })

                res.status(201).json({
                    message: "User created successfully",
                    result
                })
            } catch (error) {
                console.error("Error creating user:", error);
                res.status(500).json({
                    message: "Error creating user",
                    error
                })
            }
        })

        // get all users
        app.get('/users', async (req, res) => {
            try {
                const allUsers = await userCollection.find().sort({ cratedAt: -1 }).toArray();
                res.status(200).json({
                    message: "Users fetched successfully",
                    allUsers
                })
            } catch (error) {
                res.status(500).json({
                    message: "Error getting users",
                    error
                })
            }
        })

        // order route create
        app.post('/order', async (req, res) => {
            try {

                const { user_id, items } = req.body;
                const user = await userCollection.findOne({ _id: new ObjectId(user_id) });
                if (!user) return res.status(404).json({ message: "User not found" });

                const totalAmmount = items.reduce((sum, item) => sum + item.price, 0);
                const result = await orderCollection.insertOne({
                    user_id: new ObjectId(user_id),
                    items,
                    totalAmmount,
                    status: "pending",
                    orderDate: new Date()
                })

                res.status(201).json({
                    message: "Order created successfully",
                    result
                })
            } catch (error) {
                res.status(500).json({
                    message: "Error creating order",
                    error
                })
            }
        })

        // get order by user_id
        app.get('/orders/:userId', async (req, res) => {
            try {
                const userId = req.params.userId;
                const orders = await orderCollection.find({ user_id: new ObjectId(userId)}).sort({ orderDate: -1}).toArray();
                res.status(201).json({
                    message: "Orders fetched successfully",
                    orders
                })
            } catch (error) {
                res.status(500).json({
                    message: "Error getting orders",
                    error
                })
            }
        })

        // delete order with user
        app.delete('/users/:id', async (req, res) => {
            try {
                const userId = req.params.id;

                await orderCollection.deleteMany({ user_id: new ObjectId(userId) });
                await userCollection.deleteOne({ _id: new ObjectId(userId) });

                res.status(200).json({
                    message: "User deleted successfully with orders"
                });
            } catch (error) {
                res.status(500).json({
                    message: "Error deleting user",
                    error
                })
            }
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('User Profile System API');
})

app.listen(port, () => {
    console.log(`User Profile System API listening on port ${port}`)
})