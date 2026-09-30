# Latitour

MVP universitario de turismo en Paraná, Entre Ríos. Incluye exploración sin registro, búsqueda, categorías, filtro de abierto ahora, mapa, fichas, favoritos locales y panel de prestadores con autenticación y CRUD en Supabase.

## Instalación

Requiere Node.js 22 y npm. En PowerShell, usá `npm.cmd` si la política de ejecución bloquea `npm.ps1`.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

En PowerShell, copiá el archivo con `Copy-Item .env.example .env.local`. Abrí http://localhost:3000. Para producción: `npm run build` y `npm start`.

Sin variables de Supabase, la aplicación ofrece **12 establecimientos ficticios de demostración**, con fotos ilustrativas. Los favoritos sí se guardan en el navegador. El acceso y el guardado de prestadores quedan deshabilitados y se explica la configuración pendiente. No se simula persistencia. Los tiempos de los datos locales se inicializan al arrancar el servidor; los datos de Supabase conservan sus fechas reales.

## Configurar Supabase

1. Creá un proyecto en Supabase.
2. En SQL Editor, ejecutá `supabase/schema.sql` y después `supabase/seed.sql`. El segundo script es idempotente: no sobrescribe cambios previos.
3. En Project Settings → API, copiá la URL y la clave pública publishable (`sb_publishable_...`) a `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU-CLAVE-PUBLICA
```

No uses `service_role`, claves secretas ni contraseñas de la base de datos en variables `NEXT_PUBLIC_*`. La seguridad de la clave pública depende de las políticas RLS incluidas.

4. En Authentication → URL Configuration, configurá Site URL como `http://localhost:3000` (la URL HTTPS real al desplegar). Habilitá Email/Password.
5. Reiniciá el servidor después de modificar variables.
6. Entrá en **Soy prestador → Registrate**, creá una cuenta con correo propio y contraseña de al menos 8 caracteres, y confirmá el correo recibido. Después iniciá sesión. Alternativamente, creá un usuario de prueba confirmado desde Authentication → Users en el dashboard de Supabase.
7. En `supabase/assign-demo.sql`, reemplazá `prestador@example.com` por ese correo y ejecutá el script en SQL Editor. Asocia los tres primeros lugares de la demostración a esa cuenta.
8. Creá una segunda cuenta para comprobar aislamiento entre propietarios.

La confirmación de correo vuelve al Site URL configurado. El usuario puede entonces iniciar sesión con su contraseña. Si no llega el mensaje, revisá los límites de correo/SMTP de tu proyecto.

## Demostración frente a la profesora

1. Abrí `/` como turista. La leyenda identifica los datos ficticios.
2. Buscá **Bruma**. Probá Gastronomía y activá **Abierto ahora**. Si pasaron 24 horas desde el seed, primero confirmá el estado desde el panel.
3. Cambiá a **Mapa** y tocá el marcador. El popup enlaza a la ficha.
4. Abrí la ficha y guardala con el corazón. Visitá **Favoritos** y recargá para verificar que persiste en el navegador.
5. En otra ventana, iniciá sesión como prestador. En el panel, cambiá Bruma del río a **Cerrado** y pulsá **Confirmar estado y disponibilidad**.
6. Volvé a la ventana del turista y pulsá **Actualizar**. El lugar desaparece del filtro abierto. Desactivá el filtro para verlo cerrado y consultá la fecha de confirmación en su ficha.
7. Probá crear, editar y eliminar un establecimiento propio. La eliminación pide confirmación. No se requieren teléfonos ni fotos: hay una imagen alternativa local.
8. Cerrá sesión e ingresá con la segunda cuenta. No debe mostrar los lugares de la primera. Intentá abrir `/panel/ID-AJENO/editar`: debe devolver no encontrado. Las políticas también impiden modificarlo directamente vía API (prueba automatizada abajo).
9. Para mostrar vencimiento, **Senderos del litoral** y **Almacén de viaje** tienen estados iniciales con 48 horas de antigüedad. Sus horarios pueden estar informados, pero el estado es sin confirmar y no aparecen como abiertos.
10. Tocá **Mi ubicación** y rechazá el permiso: el mapa permanece disponible y vuelve a Paraná. No se solicita geolocalización al cargar la página.

Para volver a confirmar un mismo estado usá el botón rápido del panel. Editar solo la descripción no renueva artificialmente el estado. Cambiarlo sí registra una nueva confirmación. La disponibilidad es informativa y no representa una reserva.

## Arquitectura y reglas

- Next.js App Router + TypeScript estricto, React y Tailwind CSS.
- Server Components consultan Supabase para exploración, fichas y panel. Filtros en la URL, enviados a Postgres; límite de 100 resultados por consulta, adecuado para este MVP de 12 lugares. No hay paginación para un catálogo de mayor escala.
- React Leaflet se importa dinámicamente con SSR deshabilitado. Los marcadores reciben los mismos resultados filtrados que las tarjetas. OpenStreetMap requiere conexión a Internet.
- Supabase SSR usa cookies y `proxy.ts` renueva sesiones. Layout privado, consultas por propietario, validación en Server Actions y RLS como límite definitivo de seguridad.
- Estado manual independiente de horarios. Vence **después** de 24 horas. Las consultas abiertas usan el mismo umbral y se recalculan al volver a consultar datos.
- Un trigger registra `updated_at` y controla `status_updated_at` con el reloj de la base de datos. Una edición de información sin cambio de estado mantiene la confirmación anterior. Se muestran fechas en `America/Argentina/Buenos_Aires`.
- React Hook Form + Zod validan en cliente y servidor; SQL agrega restricciones y políticas. Sonner comunica éxito y error.
- Componentes locales de estilo shadcn/ui (Radix Slot, CVA, controles nativos accesibles) personalizados con la identidad Latitour. Diálogo destructivo accesible con Radix Alert Dialog.
- Adaptación liviana de FadeContent de React Bits para la bienvenida, con Web Animations API y preferencia de movimiento reducido, sin agregar una dependencia de animación. Ver `THIRD_PARTY_NOTICES.md`.
- Fotografías remotas ilustrativas de Unsplash. Se optimizan con Next Image; las URLs HTTPS personalizadas usan carga nativa diferida para evitar habilitar un proxy de imágenes arbitrario.
- Favoritos: `localStorage`, sin cuenta y sin sincronización entre dispositivos. Si un lugar se elimina, deja de mostrarse aunque su identificador siga guardado localmente.
- No incluye pagos, reservas, chat ni IA.

## Verificación

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Las pruebas del navegador usan Playwright/Chromium. La primera vez: `npx playwright install chromium`. Ejecutá primero `npm run build`; las pruebas inician el servidor de producción en el puerto 3100. Las pruebas de demo esperan un entorno sin variables Supabase.

Para verificar RLS contra tu proyecto real, creá `.env.test.local` (ignorado por Git):

```dotenv
TEST_OWNER_EMAIL=correo-de-la-primera-cuenta
TEST_OWNER_PASSWORD=contraseña-de-prueba
TEST_OTHER_EMAIL=correo-de-la-segunda-cuenta
TEST_OTHER_PASSWORD=contraseña-de-prueba
```

Ejecutá `npm run test:rls`. La prueba usa exclusivamente la clave pública, inicia sesión en dos cuentas distintas, crea un lugar temporal, comprueba lectura anónima, actualización del propietario, rechazo de edición/eliminación/inserción ajenas, rechazo de transferencia de propiedad y control de fecha. Comprueba que el cambio aparece en una consulta pública y elimina su dato temporal en `finally`.

Sin un proyecto Supabase y dos cuentas configuradas, no se puede ejecutar la prueba de integración remota ni certificar el recorrido de autenticación real. El código y el script quedan preparados; no se generan credenciales ficticias.

El seed puede regenerarse con `npm run seed:generate`.

## Referencias

- [Next.js App Router](https://nextjs.org/docs/app/getting-started/installation)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [React Leaflet](https://react-leaflet.js.org/docs/start-installation/)
- [shadcn/ui](https://ui.shadcn.com/docs/components/radix/button)
- [React Bits](https://github.com/DavidHDev/react-bits)

Las skills Impeccable, frontend y Next.js no estaban instaladas en el entorno de desarrollo. Se realizó la implementación con las herramientas disponibles.
La suite local (
pm test) también ejecuta el esquema SQL y el seed en PostgreSQL embebido (PGlite), con roles anónimo y autenticados. Verifica RLS, rechazo de transferencias de propiedad, vencimiento y timestamps. Esto verifica las políticas SQL sin reemplazar la prueba contra Supabase real.
