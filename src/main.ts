// src/main.ts
import { createNestApp } from './app.factory';

async function bootstrap() {
  const app = await createNestApp();
  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
  console.log('📘 Swagger Docs available at http://localhost:3000/docs');
}
bootstrap();
