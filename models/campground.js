const mongoose = require('mongoose');
const Scheema = mongoose.Schema; 

const CampgroundSchema = new Scheema({
    title: String,
    image: String,
    price: String,
    description: String,
    location: String,
});

 module.exports = mongoose.model('Campground', CampgroundSchema);