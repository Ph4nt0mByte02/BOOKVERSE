// BOOKVERSE - Automated Test Suite
import assert from "node:assert";
import http from "node:http";
import app from "../src/server.js";

const PORT = 4099;
let server;

function makeRequest(path, method = "GET", body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = { ...headers };
    let payload = null;
    if (body) {
      payload = JSON.stringify(body);
      reqHeaders["Content-Type"] = "application/json";
      reqHeaders["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        hostname: "localhost",
        port: PORT,
        path,
        method,
        headers: reqHeaders
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ statusCode: res.statusCode, data: parsed });
          } catch {
            resolve({ statusCode: res.statusCode, data });
          }
        });
      }
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log("\n🧪 Ejecutando Suite de Pruebas Automatizadas de BOOKVERSE...\n");

  server = app.listen(PORT, async () => {
    try {
      // Test 1: Health Check
      console.log("▶ [Test 1] Verificando Endpoint de Salud /api/health...");
      const health = await makeRequest("/api/health");
      assert.strictEqual(health.statusCode, 200);
      assert.strictEqual(health.data.status, "OK");
      console.log("  ✓ /api/health respondió exitosamente con status OK");

      // Test 2: Catálogo de Libros
      console.log("▶ [Test 2] Verificando Catálogo /api/books...");
      const booksRes = await makeRequest("/api/books");
      assert.strictEqual(booksRes.statusCode, 200);
      assert.ok(booksRes.data.books.length > 0);
      console.log(`  ✓ /api/books retornó ${booksRes.data.books.length} libros`);

      // Test 3: Detalle de Libro
      console.log("▶ [Test 3] Verificando Detalle /api/books/book-001...");
      const bookRes = await makeRequest("/api/books/book-001");
      assert.strictEqual(bookRes.statusCode, 200);
      assert.strictEqual(bookRes.data.book.title, "Cien Años de Soledad");
      console.log("  ✓ /api/books/book-001 retornó el libro correcto");

      // Test 4: Autenticación Admin
      console.log("▶ [Test 4] Verificando Autenticación de Administrador...");
      const loginRes = await makeRequest("/api/auth/login", "POST", {
        email: "admin@bookverse.com",
        password: "AdminBookverse2026!"
      });
      assert.strictEqual(loginRes.statusCode, 200);
      assert.ok(loginRes.data.token, "Debe retornar un token JWT");
      console.log("  ✓ Login de admin exitoso y JWT generado correctamente");

      // Test 5: Simulación de Checkout
      console.log("▶ [Test 5] Verificando Registro de Pedido /api/orders...");
      const orderRes = await makeRequest("/api/orders", "POST", {
        customerName: "Prueba Test",
        customerEmail: "test@bookverse.demo",
        totalCOP: 65000,
        items: [{ bookId: "book-001", quantity: 1 }]
      });
      assert.strictEqual(orderRes.statusCode, 201);
      assert.ok(orderRes.data.order.orderNumber.startsWith("BV-2026-"));
      console.log(`  ✓ Pedido simulado registrado con éxito: ${orderRes.data.order.orderNumber}`);

      console.log("\n==============================================");
      console.log("🎉 TODAS LAS PRUEBAS (5/5) PASARON EXITOSAMENTE");
      console.log("==============================================\n");

      server.close();
      process.exit(0);
    } catch (err) {
      console.error("❌ Fallo en las pruebas:", err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
