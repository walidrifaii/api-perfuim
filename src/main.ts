// src/main.ts
import { createNestApp } from './app.factory';

async function bootstrap() {
  const app = await createNestApp();

  // ✅ Use dynamic port for Vercel
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📘 Swagger Docs available at http://localhost:${port}/docs`);
}
bootstrap();
