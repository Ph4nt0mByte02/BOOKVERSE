-- BOOKVERSE Database Initialization Script
-- PostgreSQL 16 schema & seed data

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Users (Admin & Staff)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    icon VARCHAR(20),
    book_count INT DEFAULT 0
);

-- Table: Books
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    editorial VARCHAR(150),
    isbn VARCHAR(50),
    description TEXT,
    description_en TEXT,
    genre VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    genre_label VARCHAR(100),
    formats TEXT[] DEFAULT ARRAY['physical', 'ebook'],
    price_cop NUMERIC(12, 2) NOT NULL,
    price_usd NUMERIC(8, 2) NOT NULL,
    availability_physical BOOLEAN DEFAULT true,
    availability_ebook BOOLEAN DEFAULT true,
    stock INT DEFAULT 10,
    cover VARCHAR(500),
    language VARCHAR(10) DEFAULT 'es',
    pages INT,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    reviews_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    published_year INT,
    sample_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Physical Stores
CREATE TABLE IF NOT EXISTS stores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    hours VARCHAR(255),
    services TEXT[],
    image VARCHAR(500),
    featured BOOLEAN DEFAULT false
);

-- Table: Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    delivery_method VARCHAR(100),
    delivery_address TEXT,
    total_cop NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    items_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin User: admin@bookverse.com / AdminBookverse2026!
-- Bcrypt hash generated for AdminBookverse2026!
INSERT INTO users (email, password_hash, name, role) 
VALUES (
    'admin@bookverse.com',
    '$2a$10$w3X.f2jC4e8J5Yt1fC11yONd5jZ0y9R4KzGg4JkXQxM1K0JqVpT9u',
    'Administrador Principal',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Seed Categories
INSERT INTO categories (id, name, name_en, icon, book_count) VALUES
('fiction', 'Ficción', 'Fiction', '📖', 4),
('self-help', 'Desarrollo Personal', 'Self-Help', '🌱', 2),
('technology', 'Tecnología', 'Technology', '💻', 2),
('business', 'Economía y Negocios', 'Business', '📈', 1),
('philosophy', 'Filosofía', 'Philosophy', '🏛️', 1),
('sci-fi', 'Ciencia Ficción', 'Sci-Fi', '🪐', 1),
('history', 'Historia', 'History', '⏳', 1),
('romance', 'Romance y Clásicos', 'Romance', '🌹', 1),
('children', 'Infantil y Juvenil', 'Children', '🎈', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Books
INSERT INTO books (id, title, author, editorial, isbn, description, genre, genre_label, formats, price_cop, price_usd, stock, cover, language, pages, rating, reviews_count, featured, published_year, sample_content) VALUES
('book-001', 'Cien Años de Soledad', 'Gabriel García Márquez', 'Editorial Sudamericana', '978-0307474728', 'La obra cumbre del realismo mágico narrando la familia Buendía en Macondo.', 'fiction', 'Ficción', ARRAY['physical', 'ebook'], 65000, 16.50, 14, 'assets/images/books/cien-anos-de-soledad.jpg', 'es', 471, 4.9, 328, true, 1967, 'Muchos años después, frente al pelotón de fusilamiento...'),
('book-002', 'Hábitos Atómicos', 'James Clear', 'Paidós Empresa', '978-6077477037', 'Un método comprobado para desarrollar buenos hábitos y eliminar los malos.', 'self-help', 'Desarrollo Personal', ARRAY['physical', 'ebook'], 58000, 14.99, 22, 'assets/images/books/habitos-atomicos.jpg', 'es', 320, 4.8, 412, true, 2018, 'El destino de tu vida depende de la calidad de tus hábitos...'),
('book-003', 'Clean Code', 'Robert C. Martin', 'Anaya Multimedia', '978-0132350884', 'Manual de estilo para desarrollo ágil y software de calidad.', 'technology', 'Tecnología', ARRAY['physical', 'ebook'], 110000, 28.00, 7, 'assets/images/books/clean-code.jpg', 'es', 464, 4.7, 195, true, 2008, 'Escribir código limpio es un arte de paciencia y disciplina...'),
('book-004', 'La Psicología del Dinero', 'Morgan Housel', 'Deusto', '978-8423432721', '19 lecciones sobre la riqueza, la codicia y la felicidad.', 'business', 'Economía y Negocios', ARRAY['physical', 'ebook'], 62000, 15.50, 18, 'assets/images/books/la-psicologia-del-dinero.jpg', 'es', 312, 4.8, 260, true, 2020, 'Tener éxito con el dinero tiene mucho que ver con tu comportamiento...'),
('book-005', 'Meditaciones', 'Marco Aurelio', 'Gredos Clásicos', '978-8424937225', 'Reflexiones estoicas sobre la serenidad mental y el deber.', 'philosophy', 'Filosofía', ARRAY['physical', 'ebook'], 49000, 12.00, 15, 'assets/images/books/meditaciones.jpg', 'es', 288, 4.9, 380, true, 180, 'Al despuntar el alba, hazte esta reflexión...'),
('book-007', 'Dune', 'Frank Herbert', 'Nova', '978-8417347987', 'La saga espacial definitiva en el planeta desértico Arrakis.', 'sci-fi', 'Ciencia Ficción', ARRAY['physical', 'ebook'], 79000, 19.90, 9, 'assets/images/books/dune.jpg', 'es', 704, 4.9, 440, true, 1965, 'Un comienzo es el momento más delicado...')
ON CONFLICT (id) DO NOTHING;

-- Seed Stores
INSERT INTO stores (id, name, city, address, phone, hours, services, image, featured) VALUES
('store-001', 'BOOKVERSE Quinta Camacho', 'Bogotá', 'Calle 70 # 9-45, Chapinero', '+57 (601) 345-6789', 'Lun-Sáb: 9:00-20:00', ARRAY['Cafetería', 'Click & Collect', 'Club de Lectura'], 'https://images.unsplash.com/photo-521587765099-8835b7231082?w=800&h=500&fit=crop', true),
('store-002', 'BOOKVERSE El Poblado', 'Medellín', 'Carrera 43A # 5A-113', '+57 (604) 448-1234', 'Lun-Sáb: 9:30-20:30', ARRAY['Terraza', 'Click & Collect', 'Zona Infantil'], 'https://images.unsplash.com/photo-507842229438-c0379366367f?w=800&h=500&fit=crop', true),
('store-003', 'BOOKVERSE Ciudad Jardín', 'Cali', 'Avenida San Joaquín # 14-88', '+57 (602) 312-9876', 'Lun-Sáb: 10:00-20:00', ARRAY['Jardín de lectura', 'Click & Collect'], 'https://images.unsplash.com/photo-526243447037-446d07fabbfb?w=800&h=500&fit=crop', false)
ON CONFLICT (id) DO NOTHING;
