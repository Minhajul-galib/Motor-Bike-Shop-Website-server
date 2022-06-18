const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


// midleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uk5kj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
  try {
    await client.connect();
    const database = client.db('nicheBikeShop');
    const productsCollection = database.collection('products');
    const orderCollection = database.collection('orders');
    const usersCollection = database.collection('users');
    const reviewsCollection = database.collection('reviews');

    // Query for a movie that has the title 'Back to the Future'
    app.get('/ok', (req, res)=>{
        res.send('ok gotten')
    })
    
    // POST API ADDING FOR PRODUCTS!
    app.post('/products', async (req, res)=>{
      console.log('hit');
      const newProducts= req.body;
      const result = await productsCollection.insertOne(newProducts);

      // console.log("hit Booked", req.body);
      // res.send('add the booked', result);
      res.json(result);
    })


    // POST API ADDING FOR reviews!
    app.post('/reviews', async (req, res)=>{
      console.log('reviews');
      const newReviews= req.body;
      const result = await reviewsCollection.insertOne(newReviews);

      // console.log("hit Booked", req.body);
      // res.send('add the booked', result);
      res.json(result);
    })

    // POST API ADDING FOR Order!
    app.post('/orders', async (req, res)=>{
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);

      // console.log("hit Booked", req.body);
      // res.send('add the booked', result);
      res.json(result);
    })

    // usersCollection Posting!
    app.post('/users', async (req, res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);

      res.json(result);
    });

    app.put('/users', async (req, res)=>{
      const user = req.body;
      const filter = {email: user.email};
      const option = { upsert: true };
      const updateDoc = {$set: user};
      const result = await usersCollection.updateOne(filter, updateDoc, option);
      res.json(result);

    });

    app.put('/users/admin', async (req, res)=>{
      const user = req.body;
      const filter = {email: user.email};
      const updateDoc = {$set: {role: 'admin'}};
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    app.get('/users/:email', async (req, res)=>{
      const email = req.params.email;
      const query = { email:email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
        isAdmin = true;
      }
      res.json({ admin: isAdmin })
    })

    app.get('/orders', async (req, res)=>{
        const cursor = orderCollection.find({});
        const order = await cursor.toArray();
        res.send(order);
    });
    
    // email filtering orders
      app.get('/orders/:email', async (req, res)=> {

        const email = req.params.email;
        const query = {email :email };
        const cursor = orderCollection.find(query);
        const myOrder = await cursor.toArray();
        res.send(myOrder);
        
    });

    app.get('/products', async (req, res)=>{
        const cursor = productsCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    });


    app.get('/reviews', async (req, res)=>{
        const cursor = reviewsCollection.find({});
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    app.get('/users', async (req, res)=>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
    });


    // Orders get id dynamic!
    app.get('/orders/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const product = await orderCollection.findOne(query);
        res.json(product);
    });


    // Products get id dynamic!
    app.get('/products/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const product = await productsCollection.findOne(query);
        res.json(product);
    });
    
    // PRODUCTS Delete API
    app.delete('/products/:id', async (req, res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);

      res.json(result);
  });

  

  } 
  finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('MOTOR BIKE IS RUNNING!!!!!!!');
})

app.listen(port, ()=>{
    console.log('SERVER PORT RUNNING WELL');
})
