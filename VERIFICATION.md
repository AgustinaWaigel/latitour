# Verificación de la entrega

Ejecutada el 30 de septiembre de 2026.

- `npm run build`: correcto, rutas públicas y privadas compiladas.
- `npm run typecheck`: correcto, TypeScript estricto.
- `npm run lint`: correcto, sin errores ni advertencias.
- `npm test`: 6 pruebas correctas. Vencimiento a las 24 horas, fechas argentinas, validación de campos y enlaces, datos de demostración y políticas SQL con PostgreSQL embebido.
- `npm run test:e2e`: 10 pruebas correctas sobre el servidor de producción, Chromium, escritorio (1440 px) y celular (390 px).
- Navegador: búsqueda, categoría, abierto ahora, ficha, guardar/quitar favoritos, persistencia tras recargar, vacío y limpieza de filtros, mapa y marcadores, rechazo de geolocalización, acceso protegido, configuración ausente y ausencia de desbordamiento horizontal.
- Revisión visual de capturas de escritorio y celular; ajuste de contraste, foco visible, tamaños táctiles y movimiento reducido.
- RLS: dos identidades y un rol anónimo en PostgreSQL embebido, con el esquema y seed de entrega. Lectura pública, escritura propia, edición/eliminación/inserción ajenas bloqueadas, transferencia de propietario bloqueada y fecha futura normalizada por el trigger. Una consulta pública posterior observa el cambio de estado.

## Límite de la verificación

No se suministraron variables de Supabase ni cuentas de prueba. No se ejecutó `npm run test:rls` contra un proyecto remoto, ni el registro/login y CRUD completo de la interfaz contra Supabase real. Los scripts y las instrucciones están incluidos en el README. Las pruebas locales no sustituyen esa comprobación de integración.
