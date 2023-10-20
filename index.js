const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// const uri = "mongodb://localhost:27017/";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amxcsfu.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const productCollection = client.db('product').collection('product')

        const cartCollection = client.db('cartDB').collection('cart')


        app.get('/product', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id
            console.log('delete data form data base', id);
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })
        
        

        app.post('/cart', async (req, res) => {
            const cart = req.body
            console.log(cart);
            const result = await cartCollection.insertOne(cart)
            res.send(result)
        })

        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })


        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const Product = req.body
            const update2 = {
                $set: {
                    name: Product.name,
                    brandName: Product.brandName,
                    category: Product.category,
                    type: Product.type,
                    price: Product.price,
                    description: Product.description,
                    rating: Product.rating,
                    url: Product.url,

                }

            }
            const result = await productCollection.updateOne(filter, update2, options)
            res.send(result)
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
    res.send('Technology and Electronics server is running')
})

app.listen(port, () => {
    console.log(`Technology and Electronics is running on port: ${port}`);
})