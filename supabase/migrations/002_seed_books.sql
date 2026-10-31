insert into public.books
  (id, title, author, editorial, isbn, description, genre, genre_label, formats,
   price_cop, price_usd, stock, cover, rating, featured, published_year, sample_content)
values
  ('book-8971', 'Until Love Sets Us Apart', 'Aditya Nighhot', 'BOOKVERSE Editorial',
   '978-1284911268', 'Nice book', 'fiction', 'Ficción', array['physical', 'ebook'],
   32000, 8, 18, 'assets/images/books/love.png', 5, true, 2026,
   'Fragmento de lectura disponible para Until Love Sets Us Apart.'),
  ('book-6835', 'Rayuela', 'Julio Cortázar', 'BOOKVERSE Editorial',
   '978-0000000000', 'Obra incorporada recientemente a nuestro catálogo general.',
   'fiction', 'Ficción', array['physical', 'ebook'], 48000, 12, 15,
   'assets/images/books/cien-anos-de-soledad.jpg', 5, true, 2026,
   'Fragmento de lectura disponible para Rayuela.'),
  ('book-001', 'Cien Años de Soledad', 'Gabriel García Márquez',
   'Editorial Sudamericana', '978-0307474728',
   'La obra cumbre del realismo mágico narrando la familia Buendía en Macondo.',
   'fiction', 'Ficción', array['physical', 'ebook'], 65000, 16.5, 14,
   'assets/images/books/cien-anos-de-soledad.jpg', 4.9, true, 1967, null),
  ('book-002', 'Hábitos Atómicos', 'James Clear', 'Paidós Empresa',
   '978-6077477037', 'Un método comprobado para desarrollar buenos hábitos.',
   'self-help', 'Desarrollo Personal', array['physical', 'ebook'], 58000, 14.99, 22,
   'assets/images/books/habitos-atomicos.jpg', 4.8, true, 2018, null),
  ('book-003', 'Clean Code', 'Robert C. Martin', 'Anaya Multimedia',
   '978-0132350884', 'Manual de estilo para desarrollo ágil.',
   'technology', 'Tecnología', array['physical', 'ebook'], 110000, 28, 7,
   'assets/images/books/clean-code.jpg', 4.7, true, 2008, null),
  ('book-004', 'La Psicología del Dinero', 'Morgan Housel', 'Deusto',
   '978-8423432721', '19 lecciones sobre la riqueza y felicidad.',
   'business', 'Economía y Negocios', array['physical', 'ebook'], 62000, 15.5, 18,
   'assets/images/books/la-psicologia-del-dinero.jpg', 4.8, true, 2020, null),
  ('book-005', 'Meditaciones', 'Marco Aurelio', 'Gredos Clásicos',
   '978-8424937225', 'Reflexiones estoicas sobre la serenidad mental.',
   'philosophy', 'Filosofía', array['physical', 'ebook'], 49000, 12, 15,
   'assets/images/books/meditaciones.jpg', 4.9, true, 180, null),
  ('book-007', 'Dune', 'Frank Herbert', 'Nova', '978-8417347987',
   'La epopeya de ciencia ficción en el planeta Arrakis.',
   'sci-fi', 'Ciencia Ficción', array['physical', 'ebook'], 79000, 19.9, 9,
   'assets/images/books/dune.jpg', 4.9, true, 1965, null)
on conflict (id) do update set
  title = excluded.title,
  author = excluded.author,
  price_cop = excluded.price_cop,
  price_usd = excluded.price_usd,
  stock = excluded.stock,
  updated_at = now();

insert into public.profiles (id, display_name, role)
values (
  '1ad4f5c4-2b16-4592-92e5-1b01258abbf9',
  'Administrador BOOKVERSE',
  'admin'
)
on conflict (id) do update set role = 'admin';
