const express = require("express");
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//set medlewar
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.5a8lj4m.mongodb.net/?retryWrites=true&w=majority`;


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


    const chocolateCollection = client.db("chocolateDb").collection("chocolate");

    app.get('/chocolate', async(req, res) => {
      const cursor = chocolateCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

  app.post('/chocolate', async(req, res) => {
    const newChocolate = req.body;
    const result = await chocolateCollection.insertOne(newChocolate);
    res.send(result)
  })

  app.delete('/chocolate/:id', async(req, res)=> {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await chocolateCollection.deleteOne(query);
    res.send(result);
  })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('the chocolate management system make');
});

app.listen(port, ()=>  {
    console.log(`the chocolate management system are runing on ${port}`)
})