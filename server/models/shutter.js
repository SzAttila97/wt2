const mongoose = require('mongoose');

const shutterSchema = new mongoose.Schema({
    width: {
        type: Number,
        require: true
    },
    height: {
        type: Number,
        require: true
    }
});

const shutter = mongoose.model('shutter', shutterSchema);

module.exports = shutter;
