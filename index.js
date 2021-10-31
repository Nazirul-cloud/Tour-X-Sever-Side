const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();



const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tyell.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);



async function run() {

    try{
        await client.connect();
        const database = client.db('tour-x');
        const packagesCollection = database.collection('packages');
        const orderCollection = database.collection('orders');

        
        //GET API
        app.get('/packages', async(req, res) =>{
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
           
        });
        //GET API
        app.get('/orders', async(req, res) =>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
           
        });

         //Add Orders API
         app.post('/order', async(req, res)=>{
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);
        })

       //POST API
        app.post('/addPackage', async(req, res) => {
         
        packagesCollection.insertOne(req.body).then((result) =>{
            res.send(result.insertedId);
        })
          
      });

      //GET MY ORDERS
      app.get('/myOrders/:email', async(req, res) => {
        
          const result = await orderCollection.find({email: req.params.email}).toArray();
          res.send(result);

      })

        //DELETE API
        app.delete('/packages/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packagesCollection.deleteOne(query);
            res.json(result);
        })
        //DELETE ORDERS
        app.delete('/orders/:key', async(req, res) =>{
            const key1 = req.params.key;
            const query = { key : key1 };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get ('/', (req, res) =>{
    res.send('Running TourX Server');
});

app.listen(port, () =>{
    console.log('TourX server on part', port)
})


