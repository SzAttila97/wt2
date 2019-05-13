const Shutter = require('./models/shutter');
const Order = require('./models/order');

const seed = async () => {
    await Shutter.remove({});
    await Order.remove({});
    const shutter1 = new Shutter({
        width: '900',
        height: '1200'
    });
    await shutter1.save();
    const shutter2 = new Shutter({
        width: '800',
        height: '1200'
    });
    await shutter2.save();
    const shutter3 = new Shutter({
        width: '600',
        height: '1200'
    });
    await shutter3.save();
    const shutter4 = new Shutter({
        width: '900',
        height: '1000'
    });
    await shutter4.save();

    const order = new Order({
        shutter: shutter4,
        shutterColor: 'Fekete',
        shutterNet: true
    });
    await order.save();
};

module.exports = seed;