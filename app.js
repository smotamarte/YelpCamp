// Call libs/modules
import express, { urlencoded } from 'express';
import { connect, connection } from 'mongoose';
import { join } from 'path';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import Campground, { find, findById, findByIdAndUpdate, findByIdAndDelete } from './models/campground';

// connect to db
connect('mongodb://localhost:27017/yelp-camp');

// error handling
const db = connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// initiate express variable
const app = express();

// express engine settings
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(urlencoded({extended: true}))
app.use(methodOverride('_method'));

// routing
// home
app.get('/', (req, res) => {
    res.render('home')
});

// home to show all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await find({});
    res.render('campgrounds/index', { campgrounds })
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
app.get('/campgrounds/:id', async(req, res) => {
    const campground = await findById(req.params.id)
    res.render('campgrounds/show', { campground }); 
});

// edit campground
app.get('/campgrounds/:id/edit', async(req, res) => {
    const campground = await findById(req.params.id)
    res.render('campgrounds/edit', { campground })
});

// edit campground logic route
app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await findByIdAndUpdate(id, { ...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
});

// delete campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await findByIdAndDelete(id);
    res.redirect('/campgrounds')
});

app.listen(5500, ()=> {
    console.log('Serving on port 5500')
});
