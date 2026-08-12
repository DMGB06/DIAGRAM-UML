# Sprints — UMLSync

Plan de trabajo de esta iteración (rediseño: interfaz + Clases/Secuencia sólidos). Cada sprint es **una unidad clara de entrega**.

| Documento | Contenido |
|---|---|
| [`proyecto.md`](./proyecto.md) | Visión, alcance de esta iteración, principios |
| **Este archivo** | Lista de sprints (resumen) |
| [`docs/superpowers/specs/`](./docs/superpowers/specs/) | Spec de diseño detallado de esta iteración |
| [`docs/contexto/`](./docs/contexto/) | Base técnica viva: arquitectura, convenciones, decisiones, glosario, flujo, errores conocidos |

---

## Reglas de los sprints

1. **Un sprint = un objetivo medible.** Si no se puede probar, no está listo.
2. **Una sola pantalla:** código y lienzo lado a lado, sin modos separados (decisión tomada — ver `proyecto.md`).
3. **No mezclar sprints:** terminar entregables del sprint actual antes de abrir el siguiente.
4. **Orden de abajo hacia arriba:** lógica/store primero, interfaz al final — la UI consume APIs del store, no al revés.
5. **Definition of Done (DoD)** común a todos:
   - `npm run build` pasa
   - `npm run test -- --run` pasa
   - `npm run lint` pasa
   - Comportamiento descrito en el sprint verificado a mano
   - Si surge una decisión nueva o un gotcha durante el sprint, se anota en `docs/contexto/decisiones.md` o `errores-conocidos.md`

---

## Mapa general (esta iteración)

```
Sprint 0   Documentación y renombrado          ✅
Sprint 1   Modelo técnico: detección + sync    ✅
Sprint 2   Clases y Secuencia sólidos (roundtrip)
Sprint 3   Rediseño de interfaz (header + contextual)
Sprint 4   Cierre, verificación y siguiente ciclo
```

Backlog post-iteración (no forma parte de estos sprints): pulir Casos de uso/Actividades, más tipos UML, CI, atajos de teclado, syntax highlighting. Ver sección Backlog al final.

---

## Sprint 0 — Documentación y renombrado ✅

**Objetivo:** Redefinir qué se construye y por qué antes de tocar código de producto.

**Entregables:**
- [x] Renombrar proyecto a **UMLSync** (`package.json`, `index.html`, `App.tsx`, docs)
- [x] `proyecto.md` reescrito con el alcance real de esta iteración
- [x] `SPRINTS.md` (este archivo) reescrito
- [x] Pack de contexto (`docs/contexto/`) generado
- [x] Spec de diseño en `docs/superpowers/specs/`

**DoD:** Documentos en repo, sin contradicciones entre ellos, nombre consistente en toda la app.

---

## Sprint 1 — Modelo técnico: detección + sincronización

**Objetivo:** Base de store confiable antes de tocar la interfaz.

**Entregables:**
- [x] `detectDiagramType(source): "class" | "sequence" | null` con tests (mín. 4 casos por tipo + caso ambiguo/vacío)
- [x] `syncStatus: "synced" | "codeDirty" | "visualDirty"` en `useDiagramStore`
- [x] Merge de layout al parsear (match nodos por id/label, no grid destructivo)
- [x] `generateFromSource` usa merge en vez de reconstruir posiciones desde cero

**DoD:** Mover nodos → parsear código de nuevo → posiciones se conservan. Tests verdes.

**Archivos clave:** `src/diagram/detectDiagramType.ts` (nuevo), `useDiagramStore.ts`, `tests/diagram/`

---

## Sprint 2 — Clases y Secuencia sólidos (roundtrip)

**Objetivo:** Los dos tipos priorizados funcionan ida y vuelta código ↔ visual de forma confiable.

**Entregables:**
- [ ] Clases: labels de relaciones visibles en el lienzo
- [ ] Secuencia: orden de mensajes estable, labels visibles en el lienzo
- [ ] Tests roundtrip código → visual → código para ambos tipos
- [ ] `docs/SUPPORTED_SYNTAX.md` documentando el subset soportado por tipo

**DoD:** Diagrama ejemplo de Clases y de Secuencia sobrevive roundtrip en tests.

**Archivos clave:** `src/diagram/parser/parseClassDiagram.ts`, `parseSequenceDiagram.ts`, `generators/toPlantUml.ts`, `toPlantUmlSequence.ts`

---

## Sprint 3 — Rediseño de interfaz

**Objetivo:** Header simplificado a máximo 4 controles visibles, apoyado en el store del Sprint 1.

**Entregables:**
- [ ] Quitar `<select>` de tipo de diagrama del header → badge de solo lectura ("Secuencia · detectado"), con selector inline solo si el código está vacío/ambiguo
- [ ] Unificar "Generar visual" + "Generar codigo" → botón **Sincronizar** con indicador de `syncStatus`
- [ ] Barra contextual flotante (solo con selección): Deshacer, Rehacer, Copiar, Pegar, Duplicar, Alinear, Distribuir, Eliminar
- [ ] Menú **⋯**: Nuevo, Importar, Copiar código, Presentación, Limpiar
- [ ] Panel izquierdo con pestañas Elementos | Código en vez de apilados

**DoD:** Header con máximo 4 controles en uso normal; verificado a mano con `npm run dev`.

**Archivos clave:** `App.tsx`, `ElementPanel.tsx`, `CodeEditor.tsx`, `src/styles/globals.css`

---

## Sprint 4 — Cierre y verificación

**Objetivo:** Confirmar que se cumplen los 6 criterios de éxito de `proyecto.md` antes de cerrar la iteración.

**Entregables:**
- [ ] Revisar los 6 criterios de éxito uno por uno
- [ ] `npm run build && npm test -- --run && npm run lint` en verde
- [ ] Confirmar que Casos de uso y Actividades no se rompieron
- [ ] Actualizar este archivo marcando la iteración cerrada
- [ ] Decidir con el usuario el siguiente ciclo (ej: pulir Casos de uso/Actividades)

**DoD:** Los 6 criterios de éxito de `proyecto.md` cumplidos y verificados.

---

## Backlog (post-iteración)

No es sprint hasta priorizar. Candidatos:

| Item | Descripción |
|---|---|
| Casos de uso / Actividades sólidos | Mismo estándar que Clases/Secuencia (roundtrip, labels, tests) |
| Diagrama de estados | Nuevo tipo UML |
| Componentes / Despliegue | Arquitectura |
| Entidad-relación | Bases de datos |
| C4 | Context / Container |
| CI | GitHub Actions: build + lint + test |
| Atajos de teclado | Ctrl+Z, Delete, etc. |
| Syntax highlight en editor | CodeMirror o similar, ligero |
| Asistente IA | Texto → diagrama |
| Colaboración | Multi-usuario (lejano) |

---

## Cómo usar este plan

1. Leer el sprint en curso en este archivo.
2. Implementar solo ese sprint (orden: 1 → 2 → 3 → 4, no saltarse).
3. Cumplir el DoD del sprint antes de marcarlo `[x]`.
4. Anotar decisiones/gotchas nuevos en `docs/contexto/` sobre la marcha.
5. Pasar al siguiente sprint.

**Siguiente paso:** implementar Sprint 1 (`detectDiagramType` + `syncStatus` + merge de layout).
