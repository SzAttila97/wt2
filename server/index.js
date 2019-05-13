const express = require('express');
const cors = require('cors');       // különböző porton fut a szerver meg a front-end
const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
const mongoose = require('mongoose'); // mongodb nodejs kliens
const seed = require('./seed'); // Alap adatok betöltése mongodb-be
const Order = require('./models/order');
const Shutter = require('./models/shutter');

// Connect to mongodb
mongoose.connect("mongodb://localhost:27017/database").then(async () => {
    await seed(); // Run seed script
    console.log("Connected to mongo");
});
//DB indítása: mongod --port 27017 --dbpath "./database"

const buildDir = path.join(__dirname + '/../build/');

// Statikus fájlok kiszolgálása
app.use(express.static(buildDir));

// Összes order lekérése
app.get('/api/customer/orders', async (req, res) => {
    const allOrders = await Order.find({}).populate('shutter');
    res.json(allOrders);
});

app.post('/api/customer/orders', async (req, res) => {
   const shutter = new Shutter({
       width: req.body.width,
       height: req.body.height
   });
   await shutter.save();

   console.log(shutter);

   const order = new Order({
       shutter: shutter,
       shutterColor: req.body.color,
       shutterNet: req.body.isNet === '1'
   });
   await order.save();

   res.json({success: true});
});

// Rendelés státusz változtatása
app.post('/api/worker/orders/:id/update-status', async (req, res) => {
    await Order.update({_id: mongoose.Types.ObjectId(req.params.id)}, {$set: {status: req.body.status}});
    res.json({success: true});
});
// Rendelés dátum változtatása
app.post('/api/manager/orders/:id/update-installationDate', async (req, res) => {
    await Order.update({_id: mongoose.Types.ObjectId(req.params.id)}, {$set: {installationDate: req.body.installationDate}});
    res.json({success: true});
});

// Összes redőny lekérése
app.get('/api/shutters', (req, res) => {
    Shutter.find({}, function(err, shutters) {
        res.json(shutters);
    });
});


// Minden egyéb lekérésre adjuk vissza az index.html-t
app.get('*', (req, res) => {
    res.sendFile(buildDir + '/../build/index.html');
});



// Szerver indítása
app.listen(80, () => {
    console.log('App is listening on port 80');
});
