const express = require('express');
const { MongoClient } = require('mongodb');
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
console.log(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db('fun_touring');
        const placeCollection = database.collection('places');

        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });
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