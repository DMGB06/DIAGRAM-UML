# UMLSync

Editor web gratuito de diagramas UML con **código** y **lienzo visual** sincronizados.

## Documentación — dónde está cada cosa

| Archivo | Ruta | Para qué sirve |
|---|---|---|
| **Visión y alcance (principal)** | [`proyecto.md`](./proyecto.md) | Qué es el proyecto, alcance de la iteración actual, criterios de éxito |
| **Sprints (plan de trabajo)** | [`SPRINTS.md`](./SPRINTS.md) | Sprint a sprint qué hacer y en qué orden |
| **Spec de diseño de esta iteración** | [`docs/superpowers/specs/`](./docs/superpowers/specs/) | Detalle completo del rediseño acordado |
| **Base técnica viva** | [`docs/contexto/`](./docs/contexto/) | Arquitectura, convenciones, decisiones, glosario, flujo de trabajo, errores conocidos |
| Nuevos diagramas | [`docs/como-agregar-nuevo-diagrama.md`](./docs/como-agregar-nuevo-diagrama.md) | Cómo agregar un tipo UML |
| Documentos históricos (pre-rediseño, no vigentes) | [`docs/plan-fases-implementacion.md`](./docs/plan-fases-implementacion.md), [`docs/proyecto.md`](./docs/proyecto.md), [`docs/arquitectura-stack.md`](./docs/arquitectura-stack.md), [`docs/ideas.md`](./docs/ideas.md), [`docs/plan-diagramas-y-editor-visual.md`](./docs/plan-diagramas-y-editor-visual.md) | Brainstorm/planificación original — desactualizados frente a `proyecto.md`, se conservan solo como referencia histórica |

**Empezar aquí:** [`proyecto.md`](./proyecto.md) (visión y alcance) → [`SPRINTS.md`](./SPRINTS.md) (qué hacer sprint a sprint) → [`docs/contexto/`](./docs/contexto/) (base técnica).

### Cómo abrirlo en Cursor

1. `Ctrl + P`
2. Escribe: `proyecto.md`
3. Enter

O en el explorador de archivos (panel izquierdo): carpeta `UML` → **`proyecto.md`**

> Nota: el archivo se llama `proyecto.md` (minúsculas), no `PROYECTO.md`.

## Inicio rápido

```bash
npm install
npm run dev
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm test` | Tests unitarios |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Stack

React 19 · Vite 8 · TypeScript 6 · React Flow · Zustand · Tailwind CSS
