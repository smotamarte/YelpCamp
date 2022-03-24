// Call libs/modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground');

// connect to db
mongoose.connect('mongodb://localhost:27017/yelp-camp');

// error handling
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// initiate express variable
const app = express();

// express engine settings
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({
    extended: true
}))
app.use(methodOverride('_method'));

// routing
// home
app.get('/', (req, res) => {
    res.render('home')
});

// home to show all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {
        campgrounds
    })
});

// add new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// logic to save new campground
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
});

// show campground in detail
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {
        campground
    });
});

// edit campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {
        campground
    })
});

// edit campground logic route
app.put('/campgrounds/:id', async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    })
    res.redirect(`/campgrounds/${campground._id}`)
});

// delete campground
app.delete('/campgrounds/:id', async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
});

app.listen(5500, () => {
    console.log('Serving on port 5500')
});