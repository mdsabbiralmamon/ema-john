const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// mongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wu8kmms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const productCollection = client.db('emaJohnDB').collection('products');

    // products api
    app.get("/products", async(req, res) => {
      console.log("pagination query", req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

        const result = await productCollection.find()
        .skip(page * size)
        .limit(size)
        .toArray();
        res.send(result);
    })

    // getting cart products IDs
    app.post("/cart-products", async(req, res) => {
      const cartItems = req.body;
      console.log("cart items", cartItems);
      const productsWithObjectIDs = cartItems.map( productObjectID => new ObjectId(productObjectID) )
      const query = {
        _id: {
          $in: productsWithObjectIDs
        }
      }
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    // getting all the products count
    app.get("/products-count", async(req, res) => {
      const  count = await productCollection.estimatedDocumentCount();
      res.send({count});
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


app.get('/', (req, res) =>{
    res.send('john is busy shopping')
})

app.listen(port, () =>{
    console.log(`ema john server is running on port: ${port}`);
})
