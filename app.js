const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
//middlewares
app.use(express.json());


//Importation des routes
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const productRoute = require('./routes/productRoutes');
const blogRoute = require('./routes/blogRoutes');
app.get('/', (req, res) => {
  res.send('Hello depuis le backend !');
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});