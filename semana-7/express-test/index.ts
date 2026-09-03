import express from 'express';
import cors from 'cors';

interface Producto {
    id: number;
    name: string;
    price: number;
    image: string;
}

const productos: Producto[] = [
    // Zapatos
    { id: 1, name: 'Zapatos Oxford Cuero Negro', price: 79.99, image: 'https://media.falabella.com.pe/falabellaPE/127974964_01/public' },
    { id: 2, name: 'Zapatos Derby Marrón', price: 84.5, image: 'https://media.falabella.com.pe/falabellaPE/148449917_01/public' },
    { id: 3, name: 'Zapatos Mocasín Azul', price: 69.9, image: 'https://media.falabella.com.pe/falabellaPE/80092964_1/public' },
    { id: 4, name: 'Zapatos Náutico Beige', price: 59.99, image: 'https://media.falabella.com.pe/falabellaPE/154505876_01/public' },
    { id: 5, name: 'Zapatos Formal Charol Negro', price: 99.0, image: 'https://media.falabella.com.pe/falabellaPE/128037522_01/public' },
    // Zapatillas
    { id: 6, name: 'Zapatillas Running Blanca', price: 89.99, image: 'https://media.falabella.com.pe/falabellaPE/154163824_01/public' },
    { id: 7, name: 'Zapatillas Urbana Negra', price: 74.9, image: 'https://media.falabella.com.pe/falabellaPE/80053808_1/public' },
    { id: 8, name: 'Zapatillas Skate Roja', price: 64.5, image: 'https://media.falabella.com.pe/falabellaPE/148254051_01/public' },
    { id: 9, name: 'Zapatillas Basketball Azul', price: 109.99, image: 'https://media.falabella.com.pe/falabellaPE/151867069_01/public' },
    { id: 10, name: 'Zapatillas Trail Verde', price: 94.0, image: 'https://media.falabella.com.pe/falabellaPE/152368268_01/public' },
    // Polos
    { id: 11, name: 'Polo Blanco', price: 24.99, image: 'https://media.falabella.com.pe/falabellaPE/152413897_01/public' },
    { id: 12, name: 'Polo Rayas Azul Marino', price: 27.5, image: 'https://media.falabella.com.pe/falabellaPE/132103191_01/public' },
    { id: 13, name: 'Polo Slim Fit Negro', price: 22.9, image: 'https://media.falabella.com.pe/falabellaPE/150908097_01/public' },
    { id: 14, name: 'Polo Manga Larga Gris', price: 29.99, image: 'https://media.falabella.com.pe/falabellaPE/154853630_01/public' },
    { id: 15, name: 'Polo Deportivo Verde', price: 26.0, image: 'https://media.falabella.com.pe/falabellaPE/20856477_1/public' },
    // Poleras
    { id: 16, name: 'Polera Básica Blanca', price: 14.99, image: 'https://media.falabella.com/falabellaPE/156980936_01/public' },
    { id: 17, name: 'Polera Estampada Negra', price: 18.5, image: 'https://media.falabella.com/falabellaPE/80083029_1/public' },
    { id: 18, name: 'Polera Oversize Beige', price: 21.9, image: 'https://media.falabella.com/tottusPE/43613354_1/public' },
    { id: 19, name: 'Polera Azul', price: 16.99, image: 'https://media.falabella.com/falabellaPE/152974341_01/public' },
    { id: 20, name: 'Polera Roja', price: 15.5, image: 'https://media.falabella.com/falabellaPE/133163092_01/public' },
];

const app = express();

app.use(cors()); 
app.use(express.json());

app.get('/products', async (req, res) => {
    // const random = Math.random();
    // if (random < 0.9) {
    //     res.status(500).json({ error: 'Error interno del servidor' });
    //     return;
    // }
    const search = req.query.search as string | undefined;
    if (search) {
        if(search.toLowerCase() === 'polo' || search.toLowerCase() === 'zapato') {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Simula un retraso de 10 segundos
        }
        const filteredProducts = productos.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
        res.json(filteredProducts);
    } else {
        res.json(productos);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});