# Píntame Móvil — Sistema de Gestión para Pinturería (React Native + Expo)

Aplicación móvil desarrollada con **React Native**, **Expo (Expo Go / SDK 54)**, **Expo Router** y **TypeScript** para el proyecto **Píntame** (`https://github.com/francor36/Pintame`), integrando la totalidad de los contenidos teóricos y prácticos de la cátedra **Aplicaciones Móviles** de la **Tecnicatura Superior en Desarrollo de Software Full Stack (ITS Cipolletti)**.

---

## 1. Definición de la Idea, Marca y Requerimientos

| Elemento | Descripción |
| :--- | :--- |
| **Nombre de la app** | **Píntame Móvil** |
| **Slogan / Identidad** | *"Optimizando procesos, transformando la gestión operativa"* |
| **Usuario objetivo** | Vendedores de mostrador, encargados de depósito y administradores de pinturerías. |
| **Problema que resuelve** | Elimina la consulta manual en planillas o depósito permitiendo verificar en tiempo real el stock, los atributos técnicos de cada pintura (`superficie`, `acabado`, `rendimiento m²/L`, `base`), registrar clientes, emitir ventas con descuento automático de stock y sugerencia de productos complementarios, escanear códigos QR de latas/comprobantes, verificar ubicación logística y fotografiar/optimizar muestras o envases. |
| **Función principal** | Consultar y gestionar inventario técnico de pinturería, cartera de clientes y punto de venta móvil conectado al backend NestJS (con soporte de datos mock demostrativos cuando se prueba sin servidor local). |

### Requerimientos Funcionales (RF) y No Funcionales (RNF)
- **RF01 (Inicio y Sesión)**: Autenticación con credenciales y token JWT persistido en `expo-secure-store`, restauración automática de sesión (`SessionProvider`) y pantalla de inicio con KPIs de inventario, alertas de stock mínimo y arqueo de caja.
- **RF02 (Listado y Filtros)**: Listado de productos con `FlatList`, búsqueda por texto y filtros por categoría (`Látex`, `Esmaltes`, `Impermeabilizantes`, `Maderas`, `Accesorios`) y stock crítico, además de listados de clientes y ventas.
- **RF03 (Detalle con Ruta Dinámica)**: Pantallas de detalle `products/[id].tsx`, `clients/[id].tsx`, `sales/[id].tsx` y `category/[name].tsx` usando `useLocalSearchParams`.
- **RF04 (Formularios Controlados)**: Alta de producto con atributos técnicos (`products/form.tsx`), alta de cliente (`clients/form.tsx`) y registro de venta en mostrador (`sales/new.tsx`) con validación de campos obligatorios y navegación programática (`router.push`).
- **RF05 (Estados de Interfaz)**: Manejo explícito de estados `loading`, `empty`, `error` y `success` mediante `FeedbackState` y `EmptyState`.
- **RF06 (Capacidades Nativas de Expo - Clases 12, 13 y 14)**:
  - Escaneo de códigos QR de latas y comprobantes (`qr-scanner.tsx`) con bloqueo de lecturas repetidas (`useQrScanner`).
  - Lectura de ubicación foreground actual vs. última conocida (`location-demo.tsx`) con clasificación de `accuracy` y edad del dato (`timestamp`).
  - Captura con cámara del sistema y galería (`media-demo.tsx` con `expo-image-picker`), cámara embebida propia (`camera-preview.tsx` con `CameraView`, `onCameraReady`, cambio frontal/trasera y desmontaje de preview) y optimización a JPEG máx. 1024px (`image.service.ts` con la API contextual de `expo-image-manipulator` y `File` de `expo-file-system`).
- **RNF01 a RNF05**: Interfaz clara con tokens centralizados en `src/constants/theme.ts`, separación estricta de responsabilidades por feature y ausencia de llamadas directas a `fetch` o bibliotecas nativas desde componentes visuales puros.

---

## 2. Mapa de Navegación y Wireframes Mínimos 

### Mapa de Navegación (Expo Router)
```text
src/app/
 ├─ _layout.tsx                      (RootLayout con SessionProvider)
 ├─ index.tsx                        (Puerta de entrada según sesión)
 ├─ forbidden.tsx                    (Estado de acceso no autorizado)
 ├─ (public)/
 │   └─ login.tsx                    (Login público con credenciales JWT)
 └─ (private)/
     ├─ _layout.tsx                  (Layout protegido + Stack configurado)
     ├─ index.tsx                    (Home: marca Píntame, KPIs y accesos)
     ├─ products/
     │   ├─ index.tsx                (Listado FlatList + filtros + búsqueda)
     │   ├─ [id].tsx                 (Detalle técnico, stock y complementarios)
     │   └─ form.tsx                 (Formulario controlado de nuevo producto)
     ├─ category/
     │   └─ [name].tsx               (Ruta dinámica por categoría)
     ├─ clients/
     │   ├─ index.tsx                (Listado de clientes particulares/empresas)
     │   ├─ [id].tsx                 (Detalle e historial de compras del cliente)
     │   └─ form.tsx                 (Formulario controlado de nuevo cliente)
     ├─ sales/
     │   ├─ index.tsx                (Arqueo de caja y listado de ventas)
     │   ├─ [id].tsx                 (Detalle de comprobante / Factura / CAE)
     │   └─ new.tsx                  (Nueva venta con descuento automático de stock)
     ├─ qr-scanner.tsx               (Práctica QR con expo-camera y useQrScanner)
     ├─ location-demo.tsx            (Clase 13: Ubicación foreground con expo-location)
     ├─ media-demo.tsx               (Clase 14 Ej. 1 y 3: ImagePicker + Optimización)
     ├─ camera-preview.tsx           (Clase 14 Ej. 2: CameraView embebida propia)
     ├─ profile.tsx                  (Perfil de usuario y logout seguro)
     ├─ about.tsx                    (Acerca de Píntame - Opción A TP Clase 6)
     └─ help.tsx                     (Guía operativa - Opción B TP Clase 6)
```

### Wireframes Conceptuales
```text
+-----------------------------------+   +-----------------------------------+
| PÍNTAME · Inicio          [ADMIN] |   | Catálogo y Stock                  |
|-----------------------------------|   |-----------------------------------|
| Hola, Alexis Bautista             |   | [ Buscar por nombre, superficie ] |
| [18 Prod] [2 Alertas] [3 Clientes]|   | (TODAS) (Látex) (Esmaltes) (...)  |
| Caja acumulada: $371.200          |   |-----------------------------------|
|-----------------------------------|   | [ ProductCard: Látex 20L        ] |
| [ Catálogo de Pinturas y Stock  ] |   | [ Sup: Mampostería · Stock: 18  ] |
| [ Iniciar Venta en Mostrador    ] |   | [ ProductCard: Esmalte 4L       ] |
| [ Escanear QR / Cámara / Ubic.  ] |   | [ + Registrar Producto          ] |
+-----------------------------------+   +-----------------------------------+

+-----------------------------------+   +-----------------------------------+
| Ficha Técnica [id]                |   | Captura y Optimización (Clase 14) |
|-----------------------------------|   |-----------------------------------|
| Látex Acrílico Interior 20L       |   | [ Tomar fotografía              ] |
| Precio: $94.500 · Stock: 18/6 u.  |   | [ Elegir de galería             ] |
|-----------------------------------|   | [ Optimizar JPEG máx. 1024px    ] |
| Atributos Técnicos:               |   |-----------------------------------|
| - Superficie: Mampostería / Yeso  |   | [ Vista previa PhotoPreview     ] |
| - Acabado: Mate · Rend: 12 m²/L   |   | Origen: camera · 1024x768px       |
| [ Complementarios sugeridos     ] |   | Reducción de bytes: 68.4%         |
+-----------------------------------+   +-----------------------------------+
```

---

## 3. Arquitectura y Responsabilidad de Cada Carpeta

Se adoptó una **arquitectura modular por feature con capas livianas** (`Presentación` -> `Aplicación/Dominio en Hooks` -> `Datos/Infraestructura en Services y lib`):

- `src/app/`: Define el árbol de rutas, layouts protegidos y pantallas delgadas que coordinan navegación y estado visual.
- `src/features/`: Agrupa cada dominio funcional del sistema:
  - `auth/`: `auth.types.ts`, `auth.service.ts`, `session.provider.tsx`, `useSession.ts`.
  - `products/`: `products.types.ts` (incluye `TechnicalAttribute` y `StockMovement`), `products.service.ts`, `useProducts.ts`, `useProductForm.ts`.
  - `clients/`: `clients.types.ts`, `clients.service.ts`, `useClients.ts`.
  - `sales/`: `sales.types.ts`, `sales.service.ts`, `useSales.ts` (descuenta stock y actualiza historial de cliente).
  - `qr/`: `useQrScanner.ts`, `qr-product.service.ts`.
  - `device-location/`: `location.types.ts`, `location.service.ts`, `useCurrentLocation.ts`.
  - `media/`: `media.types.ts`, `media.service.ts` (`expo-image-picker`), `image.service.ts` (`expo-image-manipulator` + `expo-file-system`), `useMediaCapture.ts`.
- `src/components/ui/`: Componentes visuales genéricos y reutilizables (`Screen.tsx`, `AppButton.tsx`, `AppInput.tsx`, `Card.tsx`, `FeedbackState.tsx`, `SectionHeader.tsx`, `EmptyState.tsx`).
- `src/components/{products,clients,sales,location,media}/`: Componentes de dominio que reciben datos por `props` sin acoplarse al backend ni abrir cámaras por cuenta propia (`ProductCard.tsx`, `ClientCard.tsx`, `SaleCard.tsx`, `LocationCard.tsx`, `LocationPermissionState.tsx`, `PhotoPreview.tsx`, `MediaActionBar.tsx`, `PermissionState.tsx`).
- `src/lib/`: Infraestructura transversal (`api/api.client.ts` para `fetch` y header `Authorization: Bearer`, y `storage/secure-storage.ts` para `expo-secure-store`).
- `src/constants/theme.ts`: Tokens visuales centralizados (colores institucionales ITS `#0E6FB8` y `#8EC644`, espaciados, radios y tipografía).

---

## 4. Instalación y Ejecución con Expo Go

1. Descomprimir el archivo ZIP y abrir una terminal en la raíz del proyecto `pintame-mobile`:
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo de Expo:
   ```bash
   npx expo start
   ```
3. Escanear el código QR desde la app **Expo Go** en Android/iOS (o presionar `a` para emulador Android / `w` para web).
4. **Credenciales de prueba incluidas**:
   - **Administrador**: `admin@pintame.com.ar` / Contraseña: `pintame123`
   - **Vendedor**: `vendedor@pintame.com.ar` / Contraseña: `pintame123`

---