import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS phones (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  full_name TEXT NOT NULL,
  ram INTEGER NOT NULL,
  storage INTEGER NOT NULL,
  price INTEGER NOT NULL,
  rating TEXT,
  rating_float REAL,
  reviews INTEGER,
  bought INTEGER,
  is_in_stock BOOLEAN NOT NULL DEFAULT true,
  product_url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

function amazonUrl(name: string): string {
  const query = encodeURIComponent(name);
  return `https://www.amazon.in/s?k=${query}`;
}

const DUMMY_PHONES = [
  { name: "Redmi Note 14 5G", brand: "Xiaomi", fullName: "Xiaomi Redmi Note 14 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 13999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 1250, bought: 8500, isInStock: true },
  { name: "Galaxy A16 5G", brand: "Samsung", fullName: "Samsung Galaxy A16 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 14999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 980, bought: 6200, isInStock: true },
  { name: "Moto G85 5G", brand: "Motorola", fullName: "Motorola Moto G85 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 15999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 720, bought: 4100, isInStock: true },
  { name: "Nord CE4 Lite", brand: "OnePlus", fullName: "OnePlus Nord CE4 Lite 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 16999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 1100, bought: 5800, isInStock: true },
  { name: "Realme 13 5G", brand: "Realme", fullName: "Realme 13 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 17999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 650, bought: 3900, isInStock: true },
  { name: "Poco M6 5G", brand: "Xiaomi", fullName: "Poco M6 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 9499, rating: "3.9 out of 5 stars", ratingFloat: 3.9, reviews: 2100, bought: 12000, isInStock: true },
  { name: "Vivo T3 5G", brand: "Vivo", fullName: "Vivo T3 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 15999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 870, bought: 5100, isInStock: true },
  { name: "IQOO Z9 5G", brand: "IQOO", fullName: "IQOO Z9 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 16999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 590, bought: 3400, isInStock: true },
  { name: "Samsung Galaxy S24 FE", brand: "Samsung", fullName: "Samsung Galaxy S24 FE 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 49999, rating: "4.5 out of 5 stars", ratingFloat: 4.5, reviews: 3200, bought: 7200, isInStock: true },
  { name: "Redmi A4 5G", brand: "Xiaomi", fullName: "Xiaomi Redmi A4 5G (4GB RAM, 64GB Storage)", ram: 4, storage: 64, price: 7999, rating: "3.8 out of 5 stars", ratingFloat: 3.8, reviews: 3400, bought: 18000, isInStock: true },
  { name: "Nothing Phone 2a", brand: "Nothing", fullName: "Nothing Phone 2a 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 18999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 1800, bought: 6500, isInStock: true },
  { name: "Samsung Galaxy A35 5G", brand: "Samsung", fullName: "Samsung Galaxy A35 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 22999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 1450, bought: 5600, isInStock: true },
  { name: "OnePlus 12R", brand: "OnePlus", fullName: "OnePlus 12R 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 34999, rating: "4.5 out of 5 stars", ratingFloat: 4.5, reviews: 2800, bought: 8900, isInStock: true },
  { name: "Realme Narzo 70x", brand: "Realme", fullName: "Realme Narzo 70x 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 11999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 1600, bought: 9200, isInStock: true },
  { name: "Poco X6 Pro", brand: "Xiaomi", fullName: "Poco X6 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 23999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 1950, bought: 7800, isInStock: true },
  { name: "Motorola Edge 50 Pro", brand: "Motorola", fullName: "Motorola Edge 50 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 29999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 920, bought: 3100, isInStock: true },
  { name: "Vivo V40 5G", brand: "Vivo", fullName: "Vivo V40 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 31999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 780, bought: 4200, isInStock: true },
  { name: "Samsung Galaxy M35 5G", brand: "Samsung", fullName: "Samsung Galaxy M35 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 16999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 2200, bought: 11000, isInStock: true },
  { name: "Redmi Note 13 Pro", brand: "Xiaomi", fullName: "Xiaomi Redmi Note 13 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 21999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 2500, bought: 9500, isInStock: true },
  { name: "IQOO Neo 9 Pro", brand: "IQOO", fullName: "IQOO Neo 9 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 26999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 1100, bought: 4800, isInStock: true },
];

async function seed() {
  console.log("Creating phones table...");
  await pool.query(CREATE_TABLE);
  console.log("Table created.");

  console.log("Inserting 20 dummy phones...");
  const values: any[] = [];
  const placeholders = DUMMY_PHONES.map((p, i) => {
    const base = i * 14;
    values.push(
      p.name, p.brand, p.fullName, p.ram, p.storage, p.price,
      p.rating, p.ratingFloat, p.reviews, p.bought,
      p.isInStock, amazonUrl(p.fullName), new Date(), new Date()
    );
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, $${base + 12}, $${base + 13}, $${base + 14})`;
  }).join(", ");

  const insertQuery = `
    INSERT INTO phones (name, brand, full_name, ram, storage, price, rating, rating_float, reviews, bought, is_in_stock, product_url, scraped_at, updated_at)
    VALUES ${placeholders}
    ON CONFLICT DO NOTHING;
  `;

  await pool.query(insertQuery, values);
  console.log("Inserted 20 dummy phones.");

  const { rows } = await pool.query("SELECT COUNT(*) as count FROM phones");
  console.log(`Total phones in table: ${rows[0].count}`);

  await pool.end();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
