# Decisiones tomadas

> Una entrada por decisión. Lo importante es el "por qué" y el "qué descartamos".

## 2026-08-11 · Nombre del proyecto: UMLSync

- **Decisión:** renombrar de "UML Visual Studio" a **UMLSync**.
- **Por qué:** "Visual Studio" es marca registrada de Microsoft; además el nuevo nombre comunica directamente el gancho real del producto (sincronización código ↔ visual), en vez de un nombre genérico.
- **Descartado:** `UML Forge` (buena connotación de construcción, pero no comunica el gancho de sincronización), `OpenUML` (sugiere open-source, lo cual no está decidido).
- **Estado:** vigente.

## 2026-08-11 · Público objetivo: amplio (devs, estudiantes, empresas)

- **Decisión:** no acotar a un solo segmento; la app se diseña para cualquiera que quiera modelar UML sin pagar licencia.
- **Por qué:** así lo definió el usuario explícitamente al arrancar el rediseño.
- **Descartado:** enfocar solo en un nicho (ej. solo estudiantes, o solo equipos de dev) — se consideró pero no se eligió.
- **Estado:** vigente.

## 2026-08-11 · Diferenciador central: código + gratis + sincronización

- **Decisión:** el gancho principal frente a PlantUML/draw.io/Lucidchart es poder trabajar con código de forma gratuita, con el lienzo siempre sincronizado.
- **Por qué:** confirmado directamente por el usuario como la razón de ser de la app, por encima de IA, plantillas o más tipos de diagrama.
- **Descartado:** posicionar el producto en torno a IA o a la variedad de tipos de diagrama soportados.
- **Estado:** vigente — cualquier feature nueva se evalúa contra este gancho antes de agregarse.

## 2026-08-11 · Alcance de tipos de diagrama: solo Clases + Secuencia por ahora

- **Decisión:** enfocar el esfuerzo de esta iteración en dejar sólidos únicamente Clases y Secuencia (roundtrip, labels, tests). Casos de uso y Actividades se mantienen "básicos" sin invertir tiempo.
- **Por qué:** el usuario prefirió explícitamente "uno o dos tipos sólidos" antes que los 4 tipos a medias — mejor profundidad que amplitud en esta fase.
- **Descartado:** mejorar los 4 tipos en paralelo (opción que se ofreció y el usuario no eligió).
- **Estado:** vigente para esta iteración. Casos de uso/Actividades quedan en backlog (`SPRINTS.md`) para una iteración futura.

## 2026-08-11 · Estructura de interfaz: una sola pantalla, no dos modos separados

- **Decisión:** descartar la idea original de `proyecto.md` (dos modos: pantalla Código / pantalla Manual). Se mantiene código + lienzo lado a lado en una sola pantalla, rediseñada para reducir ruido visual.
- **Por qué:** separar en dos pantallas contradice el gancho central del producto (ver decisión de diferenciador) — el valor está en ver código y lienzo sincronizados a la vez, no en trabajar con uno oculto. Además, dos pantallas duplican el esfuerzo de construcción (dos layouts) para un MVP que debe priorizar dejar Clases+Secuencia sólidos.
- **Descartado:**
  - Opción A: dos modos/pantallas separados (visión original de `proyecto.md`, antes de este rediseño).
  - Opción C: modo "enfoque" con toggle de pantalla completa — descartado por ser complejidad de estado equivalente a la opción elegida sin beneficio real, dado que el panel de código ya es colapsable (`isCodePanelOpen`).
- **Estado:** vigente.

## 2026-08-11 · Interfaz simplificada: badge de tipo + botón Sincronizar + barra contextual + menú ⋯

- **Decisión:** header con máximo 4 controles visibles (badge de tipo detectado, botón Sincronizar con estado, Exportar, menú ⋯); acciones de edición (alinear, copiar, etc.) se mueven a una barra contextual flotante que solo aparece con selección.
- **Por qué:** ataca directamente el dolor reportado ("20 botones sin jerarquía") sin requerir el rediseño arquitectónico de dos modos.
- **Descartado:** mantener todos los botones siempre visibles agrupados en `toolbar-group` (estado actual pre-rediseño).
- **Estado:** vigente, pendiente de implementar en Sprint 3 (`SPRINTS.md`).

## 2026-08-11 · Reescritura de `proyecto.md` y `SPRINTS.md`, pack de contexto nuevo

- **Decisión:** reescribir por completo `proyecto.md` (raíz) y `SPRINTS.md` para reflejar las decisiones de este rediseño, y crear `docs/contexto/` (este pack de 6 documentos) como base técnica viva, referenciada desde `README.md`.
- **Por qué:** el usuario reportó que el proyecto "no se sentía bien definido" — la causa raíz era que existían documentos contradictorios (visión ambiciosa de 12 sprints en `SPRINTS.md`, un `docs/proyecto.md` distinto y más antiguo con stack no implementado, y código ya más avanzado que "Sprint 1"). Un solo documento de visión vigente + un pack de contexto vivo resuelve la ambigüedad.
- **Descartado:** dejar los documentos viejos como estaban y solo agregar el spec de esta iteración encima — se descartó porque perpetuaba la contradicción que causó la confusión original.
- **Estado:** vigente. `docs/proyecto.md`, `docs/arquitectura-stack.md` y `docs/ideas.md` se conservan sin reescribir, marcados como históricos/no vigentes en `README.md` (no se tocó su contenido para no perder el brainstorm original).

## 2026-08-12 · Rediseño visual: de grafito+latón a "papel técnico"

- **Decisión:** reemplazar el sistema de tokens oscuro grafito+latón de Sprint 3 por "papel técnico": fondo claro por defecto con tema oscuro opcional, tipografías autohospedadas Space Grotesk (display) + IBM Plex Mono (código), y un acento de color distinto por tipo de diagrama (azul=Clases, rojo=Secuencia, ámbar=Casos de uso, verde=Actividades) aplicado de forma consistente desde el header hasta los nodos del lienzo, en vez de un único acento decorativo.
- **Por qué:** el usuario pidió explícitamente un diseño "profesional, no genérico". Se trabajó con la skill `frontend-design` y un companion visual antes de escribir el spec, para validar dirección estética con evidencia visual en vez de iterar a ciegas sobre código.
- **Descartado:** mantener el acento único grafito+latón (leído como genérico/plantilla, no diferenciaba tipos de diagrama).
- **Estado:** vigente.
