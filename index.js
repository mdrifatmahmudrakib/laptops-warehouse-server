const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agq2x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();

        const inventoryCollection = client.db('laptopWarehouse').collection('products');




        app.get('/inventories', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        });




        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);
        })

        //delete
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollection.deleteOne(query);
            res.send(inventory);
        });


        //  POST
        app.post('/additem', async (req, res) => {
            const newitem = req.body;
            const result = await inventoryCollection.insertOne(newitem);
            res.send(result);
        });





    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running warehouse server');
});


app.listen(port, () => {
    console.log('listining to port', port);
})