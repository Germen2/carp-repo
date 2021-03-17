//Monitor para carpintería, rífatela

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongoDB = {useUnifiedTopology: true}
const path = require('path');

mongo_uri = 'mongodb+srv://german:5j0HsHdSu73ERa2O@cluster0.jvyx1.mongodb.net/test'

app.set('views', path.join(__dirname,'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')

mongoRead = async (database, collection, query) =>{
    const client = new MongoClient(mongo_uri, mongoDB)
    try{
        await client.connect()
        const db = client.db(database)
        const col = db.collection(collection)
        let data = await col.find(query).toArray()
        await client.close()
        return data
    } catch (err) {
        console.log(err.stack)
    }
}

app.get('/', (req, res) =>{
    data = mongoRead('clientes', 'datos', {})
    res.render('si.html')
})

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})