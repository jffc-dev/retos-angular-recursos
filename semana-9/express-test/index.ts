import express from 'express';
import cors from 'cors';

interface Variant {
    variant_id: string;
    product_id: string;
    product_name: string;
    price: number;
    image_url: string;
    category_names: string[];
}

const variants: Variant[] = [
    // Zapatos
    { variant_id: '1', product_id: '1', product_name: 'Zapatos Oxford Cuero Negro', price: 79.99, image_url: 'https://media.falabella.com.pe/falabellaPE/127974964_01/public', category_names: ['Zapatos'] },
    { variant_id: '2', product_id: '2', product_name: 'Zapatos Derby Marrón', price: 84.5, image_url: 'https://media.falabella.com.pe/falabellaPE/148449917_01/public', category_names: ['Zapatos'] },
    { variant_id: '3', product_id: '3', product_name: 'Zapatos Mocasín Azul', price: 69.9, image_url: 'https://media.falabella.com.pe/falabellaPE/80092964_1/public', category_names: ['Zapatos'] },
    { variant_id: '4', product_id: '4', product_name: 'Zapatos Náutico Beige', price: 59.99, image_url: 'https://media.falabella.com.pe/falabellaPE/154505876_01/public', category_names: ['Zapatos'] },
    { variant_id: '5', product_id: '5', product_name: 'Zapatos Formal Charol Negro', price: 99.0, image_url: 'https://media.falabella.com.pe/falabellaPE/128037522_01/public', category_names: ['Zapatos'] },
    // Zapatillas
    { variant_id: '6', product_id: '6', product_name: 'Zapatillas Running Blanca', price: 89.99, image_url: 'https://media.falabella.com.pe/falabellaPE/154163824_01/public', category_names: ['Zapatillas'] },
    { variant_id: '7', product_id: '7', product_name: 'Zapatillas Urbana Negra', price: 74.9, image_url: 'https://media.falabella.com.pe/falabellaPE/80053808_1/public', category_names: ['Zapatillas'] },
    { variant_id: '8', product_id: '8', product_name: 'Zapatillas Skate Roja', price: 64.5, image_url: 'https://media.falabella.com.pe/falabellaPE/148254051_01/public', category_names: ['Zapatillas'] },
    { variant_id: '9', product_id: '9', product_name: 'Zapatillas Basketball Azul', price: 109.99, image_url: 'https://media.falabella.com.pe/falabellaPE/151867069_01/public', category_names: ['Zapatillas'] },
    { variant_id: '10', product_id: '10', product_name: 'Zapatillas Trail Verde', price: 94.0, image_url: 'https://media.falabella.com.pe/falabellaPE/152368268_01/public', category_names: ['Zapatillas'] },
    // Polos
    { variant_id: '11', product_id: '11', product_name: 'Polo Blanco', price: 24.99, image_url: 'https://media.falabella.com.pe/falabellaPE/152413897_01/public', category_names: ['Polos'] },
    { variant_id: '12', product_id: '12', product_name: 'Polo Rayas Azul Marino', price: 27.5, image_url: 'https://media.falabella.com.pe/falabellaPE/132103191_01/public', category_names: ['Polos'] },
    { variant_id: '13', product_id: '13', product_name: 'Polo Slim Fit Negro', price: 22.9, image_url: 'https://media.falabella.com.pe/falabellaPE/150908097_01/public', category_names: ['Polos'] },
    { variant_id: '14', product_id: '14', product_name: 'Polo Manga Larga Gris', price: 29.99, image_url: 'https://media.falabella.com.pe/falabellaPE/154853630_01/public', category_names: ['Polos'] },
    { variant_id: '15', product_id: '15', product_name: 'Polo Deportivo Verde', price: 26.0, image_url: 'https://media.falabella.com.pe/falabellaPE/20856477_1/public', category_names: ['Polos'] },
    // Poleras
    { variant_id: '16', product_id: '16', product_name: 'Polera Básica Blanca', price: 14.99, image_url: 'https://media.falabella.com/falabellaPE/156980936_01/public', category_names: ['Poleras'] },
    { variant_id: '17', product_id: '17', product_name: 'Polera Estampada Negra', price: 18.5, image_url: 'https://media.falabella.com/falabellaPE/80083029_1/public', category_names: ['Poleras'] },
    { variant_id: '18', product_id: '18', product_name: 'Polera Oversize Beige', price: 21.9, image_url: 'https://media.falabella.com/tottusPE/43613354_1/public', category_names: ['Poleras'] },
    { variant_id: '19', product_id: '19', product_name: 'Polera Azul', price: 16.99, image_url: 'https://media.falabella.com/falabellaPE/152974341_01/public', category_names: ['Poleras'] },
    { variant_id: '20', product_id: '20', product_name: 'Polera Roja', price: 15.5, image_url: 'https://media.falabella.com/falabellaPE/133163092_01/public', category_names: ['Poleras'] },
];

const categories = [...new Set(variants.flatMap(v => v.category_names))].map(name => ({ name }));

// Filtros al estilo PostgREST usados por Supabase: `ilike.*termino*` y `cs.{valor}`
function parseIlike(value: string): string {
    const match = value.match(/^ilike\.\*(.*)\*$/i);
    return (match ? match[1] : value).toLowerCase();
}

function parseContains(value: string): string {
    const match = value.match(/^cs\.\{(.*)\}$/i);
    return match ? match[1] : value;
}

const app = express();

app.use(cors({ exposedHeaders: ['Content-Range'] }));
app.use(express.json());

app.get('/catalog_variants', async (req, res) => {
    const productNameFilter = req.query.product_name as string | undefined;
    const categoryFilter = req.query.category_names as string | undefined;

    const search = productNameFilter ? parseIlike(productNameFilter) : undefined;
    const category = categoryFilter ? parseContains(categoryFilter) : undefined;

    if (search && (search === 'polo' || search === 'zapato')) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Simula un retraso de 10 segundos
    }

    let result = variants;

    if (search) {
        result = result.filter(variant => variant.product_name.toLowerCase().includes(search));
    }

    if (category) {
        result = result.filter(variant => variant.category_names.some(name => name.toLowerCase() === category.toLowerCase()));
    }

    const total = result.length;

    // Supabase usa el header `Range` para paginar (ej: "0-11") y responde con `Content-Range`
    const rangeHeader = req.headers['range'] as string | undefined;
    let desde = 0;
    let hasta = total > 0 ? total - 1 : 0;

    if (rangeHeader) {
        const [desdeStr, hastaStr] = rangeHeader.split('-');
        desde = Number(desdeStr);
        hasta = Number(hastaStr);
    }

    const pagina = result.slice(desde, hasta + 1);

    res.setHeader('Content-Range', `${desde}-${Math.max(desde, Math.min(hasta, total - 1))}/${total}`);
    res.json(pagina.map(({ category_names, ...producto }) => producto));
});

app.get('/category', (req, res) => {
    res.json(categories);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
