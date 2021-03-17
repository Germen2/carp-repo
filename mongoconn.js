const http = require('http')
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient
const { ObjectId } = require('mongodb')
const { RSA_X931_PADDING } = require('constants')

var port = 3020

var uriDB = `URI DE BASE DE DATOS`
//var uriDB = "mongodb://54.89.97.85:27017"
const mongoDB = {useUnifiedTopology: true}

mongoRead = async (database, collection, query) =>{
    const client = new MongoClient(uriDB, mongoDB)
    try{
        await client.connect()
        const db = client.db(database)
        const col = db.collection(collection)
        let r = await col.find(query).toArray()
        await client.close()
        return r
    } catch (err) {
        console.log(err.stack)
    }
}

const server = http.createServer(async function(req, res){
    let url = req.url
    console.log(url)
    switch (url) {
        case '/event':
            async function event(){
                let x = await fs.readFileSync('event.html', 'utf8')
                let x1 = '' //Events
                let x11 = ''
                //let x22 = ''
                let x33 = ''
                let x44 = ''
                let x2 = '' //Activities (Disabled)
                let x3 = '' //Hit Platform
                let x4 = '' //Event Category
                /*
                let xl = ''
                let re = await mongoRead('tracker', 'test4', {})
                //console.log(re)
                for (r of re){
                    if (xl != '') xl += ','
                    xl += `["${r._id}", ${r.rows}]`
                }
                
                let x2 = ''
                let re2 = await mongoRead('tracker', 'test5', {})
                for (r of re2){
                    if (x2 != '') x2 += ','
                    x2 += `"${r._id}",${r.evaluacion},${r.practica},${r.explicacion},${r.reto}`
                }
                

                let x3 = ''
                let re3 = await mongoRead('tracker', 'hitplatform', {})
                for (r3 of re3){
                    if (x3 != '') x3 += ','
                    x3 += `["${r3._id}", ${r3.rows}]`
                    
                }
                */
                
                let keys
                let res = await mongoRead('tracker', 'test5', {})
                //let re4 = await mongoRead('tracker', 'eventCategory', {})

                //console.log(res)
                for (i of res){

                    //para event
                    keys = Object.keys(i.event)
                    //x11 += `{"${i.date}":[`
                    for (eventKey of keys){
                        if (x1 != '') x1 += ','
                        x1 += `["${eventKey}", ${i.event[eventKey]}]`
                    }
                    
                    if (x11 != '') x11 += ','
                    x11 += `["${i.date}",[`+x1+`]]`
                    x1 = ''

                    //para Activities (Aun no hay)


                    //para Hit Platform
                    keys = Object.keys(i.platform)
                    for (platformKey of keys){
                        if (x3 != '') x3 += ','
                        x3 += `["${platformKey}", ${i.platform[platformKey]}]`
                    }

                    if (x33 != '') x33 += ','
                    x33 += `["${i.date}",[`+x3+`]]`
                    x3 = ''

                    //para Category
                    keys = Object.keys(i.category)
                    for (categoryKey of keys){
                        if (x4 != '') x4 += ','
                        x4 += `["${categoryKey}", ${i.category[categoryKey]}]`
                    }

                    if (x44 != '') x44 += ','
                    x44 += `["${i.date}",[`+x4+`]]`
                    x4 = ''
                }
                //arreglos filtrados
                x = x.replace(/%dat%/, x11)
                x = x.replace(/%dat2%/, x2)
                x = x.replace(/%dat3%/, x33)
                x = x.replace(/%dat4%/, x44)

                //un valor maximo para cada slider
                x = x.replace(/%max%/, res.length-1)
                x = x.replace(/%max1%/, res.length-1)
                x = x.replace(/%max2%/, res.length-1)
                return x
            }
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(await event())
            break

            default:
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end('Hola')
                break
    }
}).listen(port)