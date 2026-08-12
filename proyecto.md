# UMLSync — Visión del proyecto

## Qué es

**UMLSync** es una aplicación web gratuita para **diseñar diagramas UML** combinando dos formas de trabajo en una sola pantalla:

1. **Código** (subset propio inspirado en PlantUML)
2. **Lienzo visual** (arrastrar, conectar, estilizar)

No reemplaza PlantUML ni es un clon de draw.io/Lucidchart. Es un **editor dual**: código y diagrama representan **el mismo modelo**, sincronizado, con exportación PNG/SVG/PDF/JSON.

## Para quién es

Devs, estudiantes y empresas que quieren modelar UML sin pagar licencia (Lucidchart, StarUML) ni perder tiempo sincronizando a mano texto y dibujo.

## El gancho: código + gratis + sincronizado

Lo que diferencia a UMLSync de las alternativas no es un tipo de diagrama exótico ni IA — es que **puedes escribir código y ver el lienzo actualizado, o mover el lienzo y ver el código actualizado, sin pagar nada y sin que se desincronicen**. Ese es el valor central; todo lo demás (temas, plantillas, más tipos de diagrama) es secundario a esto.

---

## Problema que resolvemos

Hoy muchas personas UML:

- Escriben PlantUML pero no ven el resultado hasta compilar en otro sitio.
- Usan editores visuales pero no obtienen código reutilizable.
- Pierden tiempo sincronizando manualmente texto ↔ dibujo.
- Pagan por herramientas visuales (Lucidchart) solo para dibujar sin código.

**Dolor actual en esta app (estado antes de este rediseño):**

| Síntoma | Causa |
|---|---|
| Demasiados botones, no se entiende qué hace cada uno | Toda la funcionalidad expuesta en barras, sin jerarquía (~20 botones fijos en el header) |
| Selector manual "Diagrama: Clases / Secuencia…" | El tipo no se infiere del código; el usuario debe elegirlo aparte |
| "Generar visual" y "Generar codigo" confunden | No hay un concepto claro de sincronización ni estado |
| Editar código y lienzo se desincronizan | No existe `syncStatus`; sincronizar puede destruir el layout manual |

---

## Alcance de esta iteración

**No estamos reconstruyendo todo el producto de una vez.** Esta iteración se enfoca en dejar sólidos los dos tipos de diagrama más usados y simplificar la interfaz, antes de ampliar a más tipos.

**Dentro de alcance:**

- Solidificar **Clases** y **Secuencia**: roundtrip código → visual → código confiable, labels de relaciones visibles, layout que no se destruye al sincronizar.
- Detección automática del tipo (`class` / `sequence`) desde el código.
- Rediseño del header a una sola pantalla simplificada (ver sección Interfaz).
- Modelo de sincronización explícito (`syncStatus`) en el store.

**Explícitamente fuera de alcance por ahora:**

- Pulir Casos de uso y Actividades (siguen funcionando "básico", no se tocan).
- Dos pantallas/modos separados (Código vs Manual) — se descartó esta idea; ver [Decisión: una sola pantalla](#decisiones-explícitas).
- Colaboración en tiempo real, IA, más tipos UML (estados, componentes, C4), compatibilidad con servidor PlantUML oficial, syntax highlighting, atajos de teclado, CI.

---

## Principio central

> **El código es la fuente de verdad del *tipo* y del *contenido* semántico.**
> **El lienzo es la fuente de verdad del *layout* (posiciones, estilos visuales).**

El usuario **no debería elegir** "Clases" o "Secuencia" en un dropdown si el código ya lo dice. La app **detecta** el tipo al leer el código y lo muestra como información, no como configuración manual.

### Detección automática del tipo (alcance de esta iteración: Clases y Secuencia)

Al parsear `@startuml … @enduml`, inferir el tipo por señales en el texto:

| Señales en el código | Tipo inferido |
|---|---|
| `class`, `interface`, `enum`, `-->`, `--\|>` | Clases |
| `participant`, `->`, `-->>` | Secuencia |

**Comportamiento objetivo:**

```
Usuario pega código  →  App detecta "Secuencia"  →  Muestra badge (no dropdown)
Usuario edita visual →  Código se actualiza       →  Tipo sigue coherente
Código vacío/ambiguo →  Selector inline solo ahí
```

El selector manual de diagrama **desaparece del header** y pasa a ser un **badge de solo lectura** ("Diagrama: Secuencia · detectado"), salvo cuando el código está vacío o es ambiguo (ahí se muestra un selector solo en ese caso).

---

## Interfaz (una sola pantalla, no dos modos)

**Decisión:** se descartó la idea original de dos pantallas separadas (Modo Código / Modo Manual). Se mantiene código + lienzo lado a lado, porque separarlos en pantallas distintas contradice el propio gancho del producto (ver sección "El gancho"). En su lugar, se simplifica la pantalla única existente.

**Barra superior (objetivo: máximo 4 controles visibles en uso normal):**

```
[ UMLSync ]   [ Secuencia · detectado ]   [ Sincronizar ▾ ]   [ Exportar ▾ ]   [ ⋯ ]
```

| Control | Función |
|---|---|
| **Badge de tipo** | Muestra el tipo inferido del código (no un `<select>` permanente) |
| **Sincronizar** | Un solo botón: aplica código → lienzo o lienzo → código, con indicador de estado (Sincronizado / Código modificado / Lienzo modificado). La última edición manda sobre `syncStatus`; no hay detección de conflicto en esta iteración |
| **Exportar** | PNG, SVG, PDF, JSON (ya funciona, se mantiene) |
| **⋯ (Más)** | Nuevo, Importar, Copiar código, Presentación, Limpiar |

**Barra contextual flotante** (solo con selección de nodos/aristas): Deshacer, Rehacer, Copiar, Pegar, Duplicar, Alinear, Distribuir, Eliminar. No ocupa espacio si no hay selección.

**Panel izquierdo:** pestañas **Elementos | Código** en lugar de apilar ambos paneles y robar espacio al lienzo.

Si un usuario quiere trabajar "solo visual", simplemente colapsa el panel de código (`isCodePanelOpen`, ya existe) — no se necesita una pantalla aparte para lograrlo.

---

## Modelo técnico (north star)

Un solo **`DiagramModel`** en el store:

```
DiagramModel
├── type          ← inferido del código (auto-detect, alcance: class/sequence)
├── source        ← texto de código
├── nodes[]       ← nodos React Flow + layout
├── edges[]       ← relaciones / mensajes
├── canvasStyle   ← fondo, etc.
└── syncStatus    ← synced | codeDirty | visualDirty
```

Flujo:

```
         parse(source)              generate(nodes, edges)
Código ─────────────────► Modelo ◄──────────────────── Lienzo
         merge layout               preservar posiciones
```

**Reglas:**

1. Parsear código **no resetea** posiciones ya guardadas (merge por id/label, no grid destructivo).
2. Toda mutación pasa por el store con historial undo coherente.
3. Parser y generador deben ser **inversos** en el subset soportado, para Clases y Secuencia.
4. El subset soportado se documenta (`docs/SUPPORTED_SYNTAX.md`) y se testea (roundtrip).

---

## Tipos de diagrama (alcance)

| Tipo | Estado | Prioridad esta iteración |
|---|---|---|
| Clases | Se deja sólido (roundtrip + labels + auto-detect) | Alta |
| Secuencia | Se deja sólido (roundtrip + labels + auto-detect) | Alta |
| Casos de uso | Se mantiene tal cual, sin invertir tiempo | No tocar por ahora |
| Actividades | Se mantiene tal cual, sin invertir tiempo | No tocar por ahora |

**Backlog futuro** (post esta iteración): pulir Casos de uso y Actividades con el mismo estándar, luego evaluar tipos nuevos (estados, componentes, C4).

---

## Criterios de éxito de esta iteración

1. Un usuario pega o escribe código de Clases o Secuencia y **ve el tipo detectado automáticamente**, sin tocar ningún selector.
2. El header tiene **como máximo 4 controles visibles** en uso normal.
3. Mover nodos en el lienzo y sincronizar **no destruye** el layout (merge, no reset).
4. Código → visual → código produce un diagrama **equivalente** para Clases y Secuencia (roundtrip).
5. `npm run build`, `npm test`, `npm run lint` pasan.
6. Casos de uso y Actividades siguen funcionando como antes (no se rompen).

---

## Stack

- React 19, Vite 8, TypeScript 6
- React Flow (`@xyflow/react`), Zustand, Zod
- Tailwind CSS 4
- Sintaxis inspirada en PlantUML (subset propio, no servidor PlantUML)

Ver detalle completo en [`docs/contexto/arquitectura.md`](./docs/contexto/arquitectura.md).

---

## Comandos de desarrollo

```bash
npm install
npm run dev
npm run build
npm test
npm run lint
npm run format
```

---

## Decisiones explícitas

| Decisión | Motivo |
|---|---|
| Nombre: UMLSync (antes "UML Visual Studio") | "Visual Studio" es marca registrada de Microsoft; el nuevo nombre comunica el gancho real (sincronización) |
| Una sola pantalla, no dos modos separados | Separar código y lienzo en pantallas distintas contradice el gancho central (ver "El gancho") |
| Enfocar Clases + Secuencia antes que los 4 tipos | Mejor dejar 2 tipos sólidos que 4 tipos a medias; Casos de uso/Actividades quedan en backlog |
| Subset propio de código, no compatibilidad total con PlantUML | Control del parser, UX predecible, sin dependencia de servidor externo |
| Tipo inferido del código | El código ya declara la intención; el dropdown es redundante y confunde |
| Menos botones, más menús y contexto | Reduce ruido; acciones frecuentes visibles, raras en ⋯ |
| JSON de proyecto como persistencia | Guarda código + layout + tipo + estilos |
| Auto-guardado en localStorage | No perder trabajo; import/export JSON para compartir |

Historial completo de decisiones (incluyendo las que se tomen durante la implementación) en [`docs/contexto/decisiones.md`](./docs/contexto/decisiones.md).

---

## Referencia rápida: de dónde viene cada cosa hoy

| Pieza actual | Archivo principal | Hacia dónde va |
|---|---|---|
| Selector "Diagrama" | `App.tsx` | Eliminar → `detectDiagramType()` |
| Generar visual / código | `useDiagramStore` | Unificar → botón `Sincronizar` con `syncStatus` |
| Parsers por tipo | `diagramRegistry.ts` | Mantener; añadir detector |
| Elementos del panel | `ElementPanel.tsx` | Filtrar por tipo detectado |
| Exportación | `exportDiagram.ts` | Mantener, ya funciona bien |

Este documento es la **fuente de verdad del producto** para esta iteración. Antes de añadir features o botones, comprobar que encajan aquí. Ver también [`SPRINTS.md`](./SPRINTS.md) para el plan de trabajo paso a paso, y [`docs/contexto/`](./docs/contexto/) para la base técnica viva del proyecto.
