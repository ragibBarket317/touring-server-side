const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//DATABASE CONECTION
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.y5uft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('fun_touring');
        const placeCollection = database.collection('places');
        const userCollection = database.collection('users');
        //Get Places
        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });
        //Get Users
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });
        // Find One id
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await placeCollection.findOne(query);
            res.send(user);
        });
        // POST User API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            console.log('hitting the server', newUser)
            res.json(result);
        });
        // POST Places API
        app.post('/places', async (req, res) => {
            const newUser = req.body;
            const result = await placeCollection.insertOne(newUser)
            console.log('hitting the server', req.body)
            res.json(result);
        });
        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            console.log('deleting user id', id);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

//GET METHOD
app.get('/', (req, res) => {
    res.send('hello from node')
})

app.listen(port, () => {
    console.log('node server running', port)
})