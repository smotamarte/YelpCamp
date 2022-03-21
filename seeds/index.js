const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities.js');
const {
    places,
    descriptors
} = require('./seedHelpers');
const Campground = require('../models/campground.js')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// unplash api function
async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'o2HLhBpH1vYdjliecmeD20b6ZuZyMF9932ujUXL45jI',
          collections: 1114848,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 2; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await seedImg(),
            price: price,
            description: 'Laboris ipsum excepteur eiusmod et ad labore laboris proident magna dolor ut. Aliqua irure non nostrud eu adipisicing ea eiusmod nulla ut tempor. Nulla amet magna nulla culpa voluptate do nulla exercitation veniam duis do pariatur velit. Enim deserunt cupidatat commodo nulla tempor mollit ipsum irure excepteur.',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})