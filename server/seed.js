const mongoose = require('mongoose');
const Category = require('./src/models/Category');

mongoose.connect('mongodb://mongo:27017/inoweb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    await insertCategories();  // Await the async function
    mongoose.disconnect(); // Disconnect after the insertion is complete
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const categories = [
    { name: 'Traditional Handicrafts', description: 'Masks, Puppets, Batik Art, Lacquerware' },
    { name: 'Textiles & Apparel', description: 'Sarongs, Handloom Fabrics, Traditional Clothing, Hand-painted Apparel' },
    { name: 'Jewelry & Accessories', description: 'Gemstone Jewelry, Beaded Jewelry, Handcrafted Bags, Natural Fiber Hats' },
    { name: 'Home Decor', description: 'Wooden Carvings, Handmade Cushions, Woven Rugs, Wall Hangings' },
    { name: 'Kitchen & Dining', description: 'Handmade Utensils, Pottery, Coconut Shell Bowls, Table Linens' },
    { name: 'Beauty & Personal Care', description: 'Natural Soaps, Herbal Oils, Skincare Products, Hair Accessories' },
    { name: 'Toys & Games', description: 'Handmade Dolls, Wooden Toys, Traditional Games, Educational Toys' },
    { name: 'Stationery', description: 'Handmade Paper, Notebooks, Greeting Cards, Calligraphy Supplies' },
    { name: 'Gifts & Souvenirs', description: 'Personalized Gifts, Souvenir Magnets, Keychains, Handmade Cards' },
    { name: 'Art & Collectibles', description: 'Paintings, Sculptures, Photography, Limited Edition Prints' }
];

async function insertCategories() {
    try {
        await Category.insertMany(categories);
    } catch (err) {
        console.error('Error inserting categories', err);
    }
}
