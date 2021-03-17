const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const fs = require ('fs');
const MongoClient = require('mongodb').MongoClient
const mongoDB = {useUnifiedTopology: true}

app.set('port', 3030);
app.set('views', path.join(__dirname,'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

uriDB = ''

fs.readFile('./uriDB.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    uriDB = data;
  });

mongoRead = async (database, collection, query) =>{
    const client = new MongoClient(uriDB, mongoDB)
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

app.get('/',async (req, res) =>{

    data = await mongoRead('clientes', 'datos', {})
    let head = `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <table class='table table-hover'><tr><th>Número de Orden</th><th>Nombre</th><th>Apellido</th><th>Direccion</th><th>Telefono</th><th>Email</th><th>Producto</th><th>Detalles</th></tr>`
    let tabla = ``
    let bottom = `</table>`
    var contador = 0
    for (let d in data){
        contador = 0
        tabla+=`<tr>`
        //cada objeto
        for (let i in data[d]){
            contador++
            if (contador == 1){
                let numero_orden = data[d][i].toString();
                var pos1 = numero_orden.length
                var pos2 = pos1-4
                numero_orden = numero_orden.slice(pos2, pos1)
                tabla+=`<td>${numero_orden}</td>`
            } else if(contador == 5){

            }else{
                tabla+=`<td>${data[d][i]}</td>`
            }
            //console.log(data[d][i])
        }
        tabla+=`</tr>`
        //console.log(data[d])
    }
    let tabla_completa = head+tabla+bottom
    //console.log(data)

    //A lo mejor puedes pasar este ciclo y usarlo en el html, pasalo por el res.render y muevele alla, luego le das formato a la tabla
    
    res.send(tabla_completa);
})




app.listen(app.get('port'), ()=>{
    console.log('Server on port 3030');
})