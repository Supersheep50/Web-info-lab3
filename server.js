const express = require('express');
const cors = require('cors');
const artistRoutes = require('./jonify/src/routes/artistRoutes');
const albumRoutes = require('./jonify/src/routes/albumRoutes');
const songRoutes = require('./jonify/src/routes/songRoutes');
require('./jonify/src/config/db'); // Ensures DB connection initializes

const app = express();
app.use(cors());
app.use(express.json());

app.use('/artists', artistRoutes);
app.use('/albums', albumRoutes);
app.use('/songs', songRoutes);

app.listen(3001, () => {
    console.log('Server started on port 3001');
});
