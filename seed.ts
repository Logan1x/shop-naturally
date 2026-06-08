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

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user_msg TEXT NOT NULL,
  filters JSONB,
  effective_filters JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

function amazonUrl(name: string): string {
  const query = encodeURIComponent(name);
  return `https://www.amazon.in/s?k=${query}`;
}

const DUMMY_PHONES = [
  // Xiaomi / Redmi / Poco (20)
  { name: "Redmi Note 14 5G", brand: "Xiaomi", fullName: "Xiaomi Redmi Note 14 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 13999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 1250, bought: 8500, isInStock: true },
  { name: "Redmi A4 5G", brand: "Xiaomi", fullName: "Xiaomi Redmi A4 5G (4GB RAM, 64GB Storage)", ram: 4, storage: 64, price: 7999, rating: "3.8 out of 5 stars", ratingFloat: 3.8, reviews: 3400, bought: 18000, isInStock: true },
  { name: "Redmi Note 13 Pro", brand: "Xiaomi", fullName: "Xiaomi Redmi Note 13 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 21999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 2500, bought: 9500, isInStock: true },
  { name: "Redmi 13 5G", brand: "Xiaomi", fullName: "Xiaomi Redmi 13 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 10999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 1800, bought: 7200, isInStock: true },
  { name: "Redmi 13C 5G", brand: "Xiaomi", fullName: "Xiaomi Redmi 13C 5G (4GB RAM, 128GB Storage)", ram: 4, storage: 128, price: 8999, rating: "3.9 out of 5 stars", ratingFloat: 3.9, reviews: 2200, bought: 14000, isInStock: true },
  { name: "Poco M6 5G", brand: "Xiaomi", fullName: "Poco M6 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 9499, rating: "3.9 out of 5 stars", ratingFloat: 3.9, reviews: 2100, bought: 12000, isInStock: true },
  { name: "Poco X6 Pro", brand: "Xiaomi", fullName: "Poco X6 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 23999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 1950, bought: 7800, isInStock: true },
  { name: "Poco M6 Pro", brand: "Xiaomi", fullName: "Poco M6 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 14999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 1100, bought: 5600, isInStock: true },
  { name: "Poco C65", brand: "Xiaomi", fullName: "Poco C65 (4GB RAM, 64GB Storage)", ram: 4, storage: 64, price: 6499, rating: "3.7 out of 5 stars", ratingFloat: 3.7, reviews: 3800, bought: 22000, isInStock: true },
  { name: "Redmi Note 14 Pro+", brand: "Xiaomi", fullName: "Xiaomi Redmi Note 14 Pro+ 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 24999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 980, bought: 4200, isInStock: true },
  { name: "Redmi K70E", brand: "Xiaomi", fullName: "Xiaomi Redmi K70E 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 22999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 870, bought: 3900, isInStock: true },
  { name: "Poco X6 5G", brand: "Xiaomi", fullName: "Poco X6 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 18999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 1600, bought: 6800, isInStock: true },
  { name: "Redmi 12 5G", brand: "Xiaomi", fullName: "Xiaomi Redmi 12 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 11499, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 2900, bought: 13500, isInStock: true },
  { name: "Poco F6", brand: "Xiaomi", fullName: "Poco F6 5G (12GB RAM, 256GB Storage)", ram: 12, storage: 256, price: 29999, rating: "4.5 out of 5 stars", ratingFloat: 4.5, reviews: 750, bought: 3200, isInStock: true },
  { name: "Redmi Note 13 5G", brand: "Xiaomi", fullName: "Xiaomi Redmi Note 13 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 12999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 3100, bought: 15000, isInStock: true },

  // Samsung (15)
  { name: "Galaxy A16 5G", brand: "Samsung", fullName: "Samsung Galaxy A16 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 14999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 980, bought: 6200, isInStock: true },
  { name: "Samsung Galaxy S24 FE", brand: "Samsung", fullName: "Samsung Galaxy S24 FE 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 49999, rating: "4.5 out of 5 stars", ratingFloat: 4.5, reviews: 3200, bought: 7200, isInStock: true },
  { name: "Samsung Galaxy A35 5G", brand: "Samsung", fullName: "Samsung Galaxy A35 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 22999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 1450, bought: 5600, isInStock: true },
  { name: "Samsung Galaxy M35 5G", brand: "Samsung", fullName: "Samsung Galaxy M35 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 16999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 2200, bought: 11000, isInStock: true },
  { name: "Samsung Galaxy M15 5G", brand: "Samsung", fullName: "Samsung Galaxy M15 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 13499, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 1800, bought: 9800, isInStock: true },
  { name: "Samsung Galaxy A55 5G", brand: "Samsung", fullName: "Samsung Galaxy A55 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 26999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 1200, bought: 4800, isInStock: true },
  { name: "Samsung Galaxy F15 5G", brand: "Samsung", fullName: "Samsung Galaxy F15 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 12999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 2600, bought: 14500, isInStock: true },
  { name: "Samsung Galaxy S23", brand: "Samsung", fullName: "Samsung Galaxy S23 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 42999, rating: "4.6 out of 5 stars", ratingFloat: 4.6, reviews: 4100, bought: 6500, isInStock: true },
  { name: "Samsung Galaxy A06", brand: "Samsung", fullName: "Samsung Galaxy A06 (4GB RAM, 64GB Storage)", ram: 4, storage: 64, price: 8499, rating: "3.8 out of 5 stars", ratingFloat: 3.8, reviews: 4200, bought: 25000, isInStock: true },
  { name: "Samsung Galaxy F35 5G", brand: "Samsung", fullName: "Samsung Galaxy F35 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 15999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 1500, bought: 8200, isInStock: true },
  { name: "Samsung Galaxy M55 5G", brand: "Samsung", fullName: "Samsung Galaxy M55 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 24999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 980, bought: 4100, isInStock: true },
  { name: "Samsung Galaxy S24 Ultra", brand: "Samsung", fullName: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB Storage)", ram: 12, storage: 256, price: 129999, rating: "4.7 out of 5 stars", ratingFloat: 4.7, reviews: 5200, bought: 8900, isInStock: true },
  { name: "Samsung Galaxy A25 5G", brand: "Samsung", fullName: "Samsung Galaxy A25 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 17999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 1100, bought: 5400, isInStock: true },
  { name: "Samsung Galaxy F06 5G", brand: "Samsung", fullName: "Samsung Galaxy F06 5G (4GB RAM, 64GB Storage)", ram: 4, storage: 64, price: 7999, rating: "3.7 out of 5 stars", ratingFloat: 3.7, reviews: 3600, bought: 19000, isInStock: true },

  // OnePlus (8)
  { name: "Nord CE4 Lite", brand: "OnePlus", fullName: "OnePlus Nord CE4 Lite 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 16999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 1100, bought: 5800, isInStock: true },
  { name: "OnePlus 12R", brand: "OnePlus", fullName: "OnePlus 12R 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 34999, rating: "4.5 out of 5 stars", ratingFloat: 4.5, reviews: 2800, bought: 8900, isInStock: true },
  { name: "OnePlus Nord CE4", brand: "OnePlus", fullName: "OnePlus Nord CE4 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 18999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 920, bought: 4600, isInStock: true },
  { name: "OnePlus Nord N35", brand: "OnePlus", fullName: "OnePlus Nord N35 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 14999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 780, bought: 3800, isInStock: true },
  { name: "OnePlus 13", brand: "OnePlus", fullName: "OnePlus 13 5G (12GB RAM, 256GB Storage)", ram: 12, storage: 256, price: 64999, rating: "4.6 out of 5 stars", ratingFloat: 4.6, reviews: 1800, bought: 5200, isInStock: true },
  { name: "OnePlus Ace 3V", brand: "OnePlus", fullName: "OnePlus Ace 3V 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 21999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 650, bought: 3100, isInStock: true },
  { name: "OnePlus Nord 4", brand: "OnePlus", fullName: "OnePlus Nord 4 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 27999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 890, bought: 4200, isInStock: true },

  // Realme (8)
  { name: "Realme 13 5G", brand: "Realme", fullName: "Realme 13 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 17999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 650, bought: 3900, isInStock: true },
  { name: "Realme Narzo 70x", brand: "Realme", fullName: "Realme Narzo 70x 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 11999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 1600, bought: 9200, isInStock: true },
  { name: "Realme GT 6T", brand: "Realme", fullName: "Realme GT 6T 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 25999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 1200, bought: 5100, isInStock: true },
  { name: "Realme 12 Pro+", brand: "Realme", fullName: "Realme 12 Pro+ 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 29999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 890, bought: 3600, isInStock: true },
  { name: "Realme Narzo 70 Pro", brand: "Realme", fullName: "Realme Narzo 70 Pro 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 15999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 1400, bought: 7800, isInStock: true },
  { name: "Realme C67", brand: "Realme", fullName: "Realme C67 4G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 9999, rating: "3.9 out of 5 stars", ratingFloat: 3.9, reviews: 2800, bought: 16000, isInStock: true },
  { name: "Realme 11 Pro", brand: "Realme", fullName: "Realme 11 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 22999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 1100, bought: 4500, isInStock: true },
  { name: "Realme Narzo 60X", brand: "Realme", fullName: "Realme Narzo 60X 5G (4GB RAM, 128GB Storage)", ram: 4, storage: 128, price: 8999, rating: "3.8 out of 5 stars", ratingFloat: 3.8, reviews: 3200, bought: 18500, isInStock: true },

  // Vivo (7)
  { name: "Vivo T3 5G", brand: "Vivo", fullName: "Vivo T3 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 15999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 870, bought: 5100, isInStock: true },
  { name: "Vivo V40 5G", brand: "Vivo", fullName: "Vivo V40 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 31999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 780, bought: 4200, isInStock: true },
  { name: "Vivo T2x 5G", brand: "Vivo", fullName: "Vivo T2x 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 12999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 1900, bought: 11000, isInStock: true },
  { name: "Vivo V30e", brand: "Vivo", fullName: "Vivo V30e 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 24999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 650, bought: 3400, isInStock: true },
  { name: "Vivo Y28", brand: "Vivo", fullName: "Vivo Y28 5G (4GB RAM, 128GB Storage)", ram: 4, storage: 128, price: 10999, rating: "3.9 out of 5 stars", ratingFloat: 3.9, reviews: 2100, bought: 13000, isInStock: true },
  { name: "Vivo X100", brand: "Vivo", fullName: "Vivo X100 5G (12GB RAM, 256GB Storage)", ram: 12, storage: 256, price: 64999, rating: "4.6 out of 5 stars", ratingFloat: 4.6, reviews: 1200, bought: 3800, isInStock: true },
  { name: "Vivo T3x 5G", brand: "Vivo", fullName: "Vivo T3x 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 11999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 1500, bought: 8800, isInStock: true },

  // IQOO (5)
  { name: "IQOO Z9 5G", brand: "IQOO", fullName: "IQOO Z9 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 16999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 590, bought: 3400, isInStock: true },
  { name: "IQOO Neo 9 Pro", brand: "IQOO", fullName: "IQOO Neo 9 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 26999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 1100, bought: 4800, isInStock: true },
  { name: "IQOO Z9x", brand: "IQOO", fullName: "IQOO Z9x 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 12999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 870, bought: 5200, isInStock: true },
  { name: "IQOO 12", brand: "IQOO", fullName: "IQOO 12 5G (12GB RAM, 256GB Storage)", ram: 12, storage: 256, price: 52999, rating: "4.5 out of 5 stars", ratingFloat: 4.5, reviews: 1400, bought: 4100, isInStock: true },
  { name: "IQOO Z7 Pro", brand: "IQOO", fullName: "IQOO Z7 Pro 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 17999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 680, bought: 3600, isInStock: true },

  // Motorola (5)
  { name: "Moto G85 5G", brand: "Motorola", fullName: "Motorola Moto G85 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 15999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 720, bought: 4100, isInStock: true },
  { name: "Motorola Edge 50 Pro", brand: "Motorola", fullName: "Motorola Edge 50 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 29999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 920, bought: 3100, isInStock: true },
  { name: "Moto G35 5G", brand: "Motorola", fullName: "Motorola Moto G35 5G (4GB RAM, 128GB Storage)", ram: 4, storage: 128, price: 9999, rating: "3.9 out of 5 stars", ratingFloat: 3.9, reviews: 2100, bought: 12000, isInStock: true },
  { name: "Moto G75 5G", brand: "Motorola", fullName: "Motorola Moto G75 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 19999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 540, bought: 2800, isInStock: true },
  { name: "Motorola Edge 50 Ultra", brand: "Motorola", fullName: "Motorola Edge 50 Ultra 5G (12GB RAM, 512GB Storage)", ram: 12, storage: 512, price: 54999, rating: "4.5 out of 5 stars", ratingFloat: 4.5, reviews: 680, bought: 2400, isInStock: true },

  // Nothing (3)
  { name: "Nothing Phone 2a", brand: "Nothing", fullName: "Nothing Phone 2a 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 18999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 1800, bought: 6500, isInStock: true },
  { name: "Nothing Phone 2", brand: "Nothing", fullName: "Nothing Phone 2 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 29999, rating: "4.5 out of 5 stars", ratingFloat: 4.5, reviews: 2100, bought: 5800, isInStock: true },
  { name: "Nothing CMF Phone 1", brand: "Nothing", fullName: "Nothing CMF Phone 1 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 14999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 950, bought: 4200, isInStock: true },

  // Apple (4)
  { name: "iPhone 15", brand: "Apple", fullName: "Apple iPhone 15 (128GB) - Blue", ram: 6, storage: 128, price: 64999, rating: "4.6 out of 5 stars", ratingFloat: 4.6, reviews: 8200, bought: 12000, isInStock: true },
  { name: "iPhone 15 Pro", brand: "Apple", fullName: "Apple iPhone 15 Pro (128GB) - Natural Titanium", ram: 8, storage: 128, price: 134900, rating: "4.7 out of 5 stars", ratingFloat: 4.7, reviews: 5800, bought: 6200, isInStock: true },
  { name: "iPhone SE 2022", brand: "Apple", fullName: "Apple iPhone SE 2022 (64GB) - Starlight", ram: 4, storage: 64, price: 49900, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 3100, bought: 4500, isInStock: true },
  { name: "iPhone 14", brand: "Apple", fullName: "Apple iPhone 14 (128GB) - Midnight", ram: 6, storage: 128, price: 56999, rating: "4.5 out of 5 stars", ratingFloat: 4.5, reviews: 7500, bought: 9800, isInStock: true },

  // Google (2)
  { name: "Pixel 8a", brand: "Google", fullName: "Google Pixel 8a 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 39999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 1200, bought: 3200, isInStock: true },
  { name: "Pixel 8 Pro", brand: "Google", fullName: "Google Pixel 8 Pro 5G (12GB RAM, 128GB Storage)", ram: 12, storage: 128, price: 89999, rating: "4.6 out of 5 stars", ratingFloat: 4.6, reviews: 2100, bought: 2800, isInStock: true },

  // Lava (3)
  { name: "Lava Blaze Curve 5G", brand: "Lava", fullName: "Lava Blaze Curve 5G (8GB RAM, 128GB Storage)", ram: 8, storage: 128, price: 10499, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 890, bought: 5200, isInStock: true },
  { name: "Lava Agni 2", brand: "Lava", fullName: "Lava Agni 2 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 15999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 560, bought: 2800, isInStock: true },
  { name: "Lava Blaze Pro 5G", brand: "Lava", fullName: "Lava Blaze Pro 5G (6GB RAM, 128GB Storage)", ram: 6, storage: 128, price: 9999, rating: "3.9 out of 5 stars", ratingFloat: 3.9, reviews: 720, bought: 4100, isInStock: true },

  // Tecno (3)
  { name: "Tecno Pova 5 Pro", brand: "Tecno", fullName: "Tecno Pova 5 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 14999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 1100, bought: 6500, isInStock: true },
  { name: "Tecno Camon 20 Pro", brand: "Tecno", fullName: "Tecno Camon 20 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 17999, rating: "4.2 out of 5 stars", ratingFloat: 4.2, reviews: 780, bought: 3800, isInStock: true },
  { name: "Tecno Spark 20 Pro+", brand: "Tecno", fullName: "Tecno Spark 20 Pro+ (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 12999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 1400, bought: 8200, isInStock: true },

  // Infinix (3)
  { name: "Infinix GT 20 Pro", brand: "Infinix", fullName: "Infinix GT 20 Pro 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 19999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 650, bought: 3200, isInStock: true },
  { name: "Infinix Hot 40 Pro", brand: "Infinix", fullName: "Infinix Hot 40 Pro (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 11999, rating: "4.0 out of 5 stars", ratingFloat: 4.0, reviews: 1800, bought: 10500, isInStock: true },
  { name: "Infinix Zero 30", brand: "Infinix", fullName: "Infinix Zero 30 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 21999, rating: "4.1 out of 5 stars", ratingFloat: 4.1, reviews: 520, bought: 2600, isInStock: true },

  // Honor (2)
  { name: "Honor X9b", brand: "Honor", fullName: "Honor X9b 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 21999, rating: "4.3 out of 5 stars", ratingFloat: 4.3, reviews: 890, bought: 4100, isInStock: true },
  { name: "Honor 200", brand: "Honor", fullName: "Honor 200 5G (8GB RAM, 256GB Storage)", ram: 8, storage: 256, price: 32999, rating: "4.4 out of 5 stars", ratingFloat: 4.4, reviews: 650, bought: 2800, isInStock: true },
];

async function seed() {
  console.log("Creating phones table...");
  await pool.query(CREATE_TABLE);
  console.log("Table created.");

  console.log(`Inserting ${DUMMY_PHONES.length} dummy phones...`);
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
  console.log(`Inserted ${DUMMY_PHONES.length} dummy phones.`);

  const { rows } = await pool.query("SELECT COUNT(*) as count FROM phones");
  console.log(`Total phones in table: ${rows[0].count}`);

  await pool.end();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
