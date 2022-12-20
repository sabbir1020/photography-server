const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.czgvc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const serviceCollection = client.db("photography").collection("services");
    const reviewCollection = client.db("photography").collection("reviews");
    const subscribeCollection = client
      .db("photography")
      .collection("subscribe");

    // mongodb post

    app.post("/subscribe", async (req, res) => {
      const subscribe = req.body;
      //   console.log(subscribe);
      const result = await subscribeCollection.insertOne(subscribe);
      res.send(result);
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      //   console.log(service);
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    // mongodb server theke data

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //  review api
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    // get reviews
    app.get("/reviews", async (req, res) => {
      // const id = req.params.id;
      const query = {};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete review

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("photography server is running");
});

app.listen(port, () => {
  console.log(`photography server is running ${port}`);
});
