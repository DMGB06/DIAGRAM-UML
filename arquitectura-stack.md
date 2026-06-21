# Arquitectura tecnica y stack del proyecto

Fecha de referencia: 2026-06-21.

Este documento define que tecnologias, librerias, versiones y estructura tecnica se recomiendan para construir el proyecto **UML Visual Studio**.

La idea es tener una base clara para empezar el desarrollo sin improvisar dependencias. Las versiones indicadas fueron consultadas como versiones actuales disponibles al momento de escribir este documento, pero antes de iniciar el desarrollo real conviene volver a verificarlas.

## 1. Enfoque tecnico recomendado

El proyecto debe iniciar como una aplicacion web moderna, enfocada primero en funcionar bien en el navegador.

La primera version no necesita backend obligatorio. El MVP puede funcionar con:

- Frontend web.
- Editor de codigo.
- Lienzo visual editable.
- Guardado local.
- Exportacion local.
- Parser inicial para diagramas de clases.

Despues, cuando el producto ya tenga una base estable, se puede agregar backend para usuarios, nube, colaboracion, versionado y proyectos compartidos.

## 2. Stack principal recomendado para el MVP

| Area | Tecnologia | Version recomendada | Uso |
| --- | --- | --- | --- |
| Runtime | Node.js | 24 LTS | Ejecutar herramientas de desarrollo |
| Package manager | pnpm | 11.8.0 | Instalar y administrar dependencias |
| Frontend | React | 19.2.7 | Construccion de interfaz |
| Build tool | Vite | 8.0.16 | Desarrollo rapido y build |
| Lenguaje | TypeScript | 6.0.3 | Tipado y mantenibilidad |
| Lienzo editable | @xyflow/react | 12.11.0 | Nodos, conexiones y editor visual |
| Editor de codigo | monaco-editor | 0.55.1 | Editor tipo VS Code |
| Estado global | Zustand | 5.0.14 | Manejo simple de estado |
| Estilos | Tailwind CSS | 4.3.1 | CSS utilitario y diseno rapido |
| Iconos | lucide-react | 1.21.0 | Iconos limpios para botones y paneles |
| Validacion | Zod | 4.4.3 | Validar datos internos |
| Tests unitarios | Vitest | 4.1.9 | Pruebas de funciones, parser y estado |
| Tests E2E | Playwright | 1.61.0 | Pruebas de interfaz completa |
| Linter | ESLint | 10.5.0 | Calidad de codigo |
| Formato | Prettier | 3.8.4 | Formato consistente |

## 3. Por que usar estas tecnologias

### 3.1 React

React es una buena opcion porque:

- Tiene ecosistema grande.
- Funciona bien con TypeScript.
- Se integra facilmente con React Flow.
- Permite construir componentes reutilizables.
- Es adecuado para herramientas visuales complejas.

Uso en el proyecto:

- Pantallas.
- Paneles.
- Barras de herramientas.
- Modales.
- Componentes del editor visual.

### 3.2 Vite

Vite sera usado como herramienta de desarrollo y build.

Ventajas:

- Arranque rapido.
- Hot reload eficiente.
- Configuracion simple.
- Buena integracion con React y TypeScript.

Uso:

- Servidor local de desarrollo.
- Build de produccion.
- Configuracion de entorno.

### 3.3 TypeScript

TypeScript es importante porque el proyecto tendra estructuras complejas:

- Nodos.
- Relaciones.
- Tipos de diagramas.
- Estilos.
- Layouts.
- Proyectos guardados.
- Errores de validacion.

Con TypeScript se evitan muchos errores al crecer el sistema.

### 3.4 React Flow / @xyflow/react

React Flow sera la pieza principal del lienzo visual.

Permitira:

- Dibujar nodos.
- Dibujar conexiones.
- Mover elementos.
- Hacer zoom.
- Hacer pan.
- Crear handles de conexion.
- Personalizar nodos.
- Personalizar edges.
- Crear un editor visual interactivo.

Uso:

- Diagrama de clases.
- Diagrama de paquetes.
- Diagrama de componentes.
- Diagramas de flujo.
- Otros diagramas basados en nodos y relaciones.

### 3.5 Monaco Editor

Monaco Editor es el editor usado por VS Code.

Permitira:

- Escribir codigo UML.
- Resaltado de sintaxis.
- Numeracion de lineas.
- Autocompletado futuro.
- Diagnosticos de errores.
- Experiencia profesional para el usuario.

Uso:

- Editor de codigo PlantUML.
- Editor de codigo Mermaid.
- Editor de formato propio.

### 3.6 Zustand

Zustand sera usado para manejar el estado global.

Estados principales:

- Proyecto actual.
- Nodos.
- Relaciones.
- Codigo fuente.
- Seleccion actual.
- Historial de undo/redo.
- Tema visual.
- Configuracion del lienzo.
- Errores de parser.

Zustand es mas simple que Redux y suficiente para el MVP.

### 3.7 Tailwind CSS

Tailwind ayudara a construir rapido la interfaz.

Uso:

- Layout general.
- Paneles.
- Toolbar.
- Botones.
- Formularios.
- Modales.
- Temas visuales.

Se recomienda usar una paleta sobria y profesional, no demasiado decorativa.

### 3.8 Lucide React

Lucide servira para los iconos de la interfaz.

Iconos necesarios:

- Guardar.
- Exportar.
- Importar.
- Zoom.
- Mover.
- Editar.
- Eliminar.
- Deshacer.
- Rehacer.
- Alinear.
- Color.
- Descargar.
- Configuracion.

### 3.9 Zod

Zod servira para validar estructuras internas.

Uso:

- Validar archivo JSON importado.
- Validar proyecto guardado.
- Validar nodos.
- Validar relaciones.
- Validar configuracion.

Esto evita que un archivo corrupto rompa la aplicacion.

## 4. Librerias para diagramas, layout y exportacion

| Area | Tecnologia | Version recomendada | Uso |
| --- | --- | --- | --- |
| Layout jerarquico simple | dagre | 0.8.5 | Ordenar nodos en capas |
| Layout avanzado | elkjs | 0.11.1 | Layouts mas potentes |
| Mermaid | mermaid | 11.15.0 | Importar/exportar o render alternativo |
| PlantUML encoder | plantuml-encoder | 1.4.0 | Generar URLs/codigo codificado PlantUML |
| Exportar imagen | html-to-image | 1.11.13 | Convertir lienzo a PNG/SVG |
| Exportar PDF | jspdf | 4.2.1 | Generar PDF |

## 5. Uso recomendado de motores externos

### 5.1 PlantUML

PlantUML puede usarse como formato de entrada o salida, pero no deberia ser la unica fuente de verdad del sistema.

Uso recomendado:

- Importar codigo `.puml`.
- Exportar codigo PlantUML.
- Permitir compatibilidad con usuarios que ya usan PlantUML.

No recomendado para el MVP:

- Depender completamente de PlantUML para el modelo interno.
- Intentar soportar toda la sintaxis PlantUML desde el inicio.

### 5.2 Mermaid

Mermaid puede ser una alternativa mas simple para algunos diagramas.

Uso recomendado:

- Exportar a Mermaid.
- Importar diagramas simples.
- Usarlo como comparacion o compatibilidad futura.

### 5.3 Formato propio

El proyecto debe tener un formato interno propio.

Motivo:

- Guardar posiciones.
- Guardar colores.
- Guardar estilos.
- Guardar metadatos visuales.
- Evitar perder cambios manuales.
- Soportar funciones que PlantUML o Mermaid no representan bien.

## 6. Arquitectura interna recomendada

La aplicacion debe dividirse en capas:

```text
Interfaz de usuario
  |
Estado global
  |
Modelo interno del diagrama
  |
Parser / Generador / Validador
  |
Importadores / Exportadores
```

## 7. Modulos tecnicos principales

### 7.1 Modulo de proyecto

Responsable de:

- Crear proyecto.
- Abrir proyecto.
- Guardar proyecto.
- Importar proyecto.
- Exportar proyecto.
- Manejar metadata.

Archivos sugeridos:

```text
src/project/projectStore.ts
src/project/projectSchema.ts
src/project/projectService.ts
```

### 7.2 Modulo de diagrama

Responsable de:

- Modelo interno.
- Nodos.
- Relaciones.
- Tipos de diagrama.
- Transformaciones.

Archivos sugeridos:

```text
src/diagram/types.ts
src/diagram/model.ts
src/diagram/constants.ts
src/diagram/factory.ts
```

### 7.3 Modulo de parser

Responsable de convertir codigo en modelo interno.

Primera version:

- Parser simple para diagrama de clases.
- Soporte basico de `class`.
- Soporte basico de relaciones.
- Soporte basico de notas.

Archivos sugeridos:

```text
src/diagram/parser/parseClassDiagram.ts
src/diagram/parser/parsePlantUml.ts
src/diagram/parser/parserErrors.ts
```

### 7.4 Modulo de generador de codigo

Responsable de convertir el modelo interno en codigo.

Archivos sugeridos:

```text
src/diagram/generators/toPlantUml.ts
src/diagram/generators/toMermaid.ts
src/diagram/generators/toInternalSource.ts
```

### 7.5 Modulo de canvas

Responsable del lienzo visual.

Archivos sugeridos:

```text
src/components/canvas/DiagramCanvas.tsx
src/components/canvas/nodes/ClassNode.tsx
src/components/canvas/nodes/PackageNode.tsx
src/components/canvas/edges/UmlEdge.tsx
src/components/canvas/CanvasToolbar.tsx
```

### 7.6 Modulo de editor de codigo

Responsable del editor textual.

Archivos sugeridos:

```text
src/components/editor/CodeEditor.tsx
src/components/editor/editorConfig.ts
src/components/editor/umlLanguage.ts
```

### 7.7 Modulo de paneles

Responsable de las herramientas laterales.

Archivos sugeridos:

```text
src/components/panels/ElementPanel.tsx
src/components/panels/PropertiesPanel.tsx
src/components/panels/ProjectPanel.tsx
src/components/panels/LayersPanel.tsx
```

### 7.8 Modulo de estilos

Responsable de temas, colores y apariencia.

Archivos sugeridos:

```text
src/styles/themes.ts
src/styles/palettes.ts
src/styles/defaultNodeStyles.ts
```

### 7.9 Modulo de exportacion

Responsable de exportar archivos.

Archivos sugeridos:

```text
src/diagram/exporters/exportPng.ts
src/diagram/exporters/exportSvg.ts
src/diagram/exporters/exportPdf.ts
src/diagram/exporters/exportJson.ts
```

### 7.10 Modulo de validacion

Responsable de validar codigo y modelo.

Archivos sugeridos:

```text
src/diagram/validators/validateDiagram.ts
src/diagram/validators/validateClassDiagram.ts
src/diagram/validators/validationMessages.ts
```

## 8. Estructura de carpetas recomendada

```text
uml-visual-studio/
  docs/
    ideas.md
    proyecto.md
    arquitectura-stack.md
    roadmap.md
  public/
    samples/
    templates/
    icons/
  src/
    app/
      App.tsx
      routes.tsx
      layout/
    components/
      canvas/
        nodes/
        edges/
      editor/
      panels/
      toolbar/
      modals/
      ui/
    diagram/
      parser/
      generators/
      validators/
      importers/
      exporters/
      layout/
      types.ts
      model.ts
    project/
      projectStore.ts
      projectSchema.ts
      projectService.ts
    store/
      useDiagramStore.ts
      useUiStore.ts
    styles/
      globals.css
      themes.ts
    utils/
    types/
    main.tsx
  tests/
    parser/
    generators/
    validators/
    e2e/
  package.json
  pnpm-lock.yaml
  tsconfig.json
  vite.config.ts
  eslint.config.js
  prettier.config.js
  README.md
```

## 9. Dependencias iniciales del MVP

Dependencias principales:

```json
{
  "dependencies": {
    "@xyflow/react": "12.11.0",
    "html-to-image": "1.11.13",
    "jspdf": "4.2.1",
    "lucide-react": "1.21.0",
    "monaco-editor": "0.55.1",
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "zustand": "5.0.14",
    "zod": "4.4.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "latest",
    "eslint": "10.5.0",
    "playwright": "1.61.0",
    "prettier": "3.8.4",
    "tailwindcss": "4.3.1",
    "typescript": "6.0.3",
    "vite": "8.0.16",
    "vitest": "4.1.9"
  }
}
```

Nota: para `@vitejs/plugin-react` conviene consultar la version exacta al momento de crear el proyecto, porque debe ser compatible con la version instalada de Vite.

## 10. Backend recomendado para fases futuras

El backend no es obligatorio para el MVP, pero sera necesario para:

- Usuarios.
- Login.
- Guardado en nube.
- Compartir diagramas.
- Colaboracion en tiempo real.
- Versionado.
- Comentarios.
- Historial remoto.

Stack futuro recomendado:

| Area | Tecnologia | Version recomendada | Uso |
| --- | --- | --- | --- |
| Backend | NestJS | 11.1.27 | API modular con TypeScript |
| ORM | Prisma | 7.8.0 | Acceso a base de datos |
| Cliente ORM | @prisma/client | 7.8.0 | Consultas desde backend |
| Base de datos | PostgreSQL | 17 o superior | Persistencia principal |
| Tiempo real | Socket.IO | 4.8.3 | Colaboracion y eventos |
| CRDT colaborativo | Yjs | 13.6.31 | Edicion colaborativa futura |

## 11. Base de datos futura

Cuando se agregue backend, las tablas principales podrian ser:

- users.
- projects.
- diagrams.
- diagram_versions.
- project_members.
- comments.
- templates.
- themes.

Modelo inicial:

```text
User
  id
  name
  email
  passwordHash
  createdAt

Project
  id
  ownerId
  name
  description
  createdAt
  updatedAt

Diagram
  id
  projectId
  name
  type
  sourceFormat
  source
  modelJson
  createdAt
  updatedAt

DiagramVersion
  id
  diagramId
  source
  modelJson
  createdAt
```

## 12. Modelo interno recomendado

El modelo interno debe ser independiente de PlantUML o Mermaid.

Ejemplo:

```ts
export type DiagramType =
  | "class"
  | "sequence"
  | "usecase"
  | "activity"
  | "state"
  | "package"
  | "component"
  | "deployment"
  | "flow";

export interface DiagramProject {
  id: string;
  name: string;
  diagramType: DiagramType;
  sourceFormat: "plantuml" | "mermaid" | "internal";
  source: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  theme: DiagramTheme;
  canvas: CanvasSettings;
  metadata: ProjectMetadata;
}
```

## 13. Orden de implementacion recomendado

### Paso 1: base del frontend

- Crear proyecto con Vite, React y TypeScript.
- Configurar Tailwind.
- Configurar ESLint y Prettier.
- Crear layout principal.

### Paso 2: lienzo

- Integrar React Flow.
- Crear nodo de clase.
- Crear edge UML.
- Permitir mover nodos.
- Guardar posiciones en Zustand.

### Paso 3: editor de codigo

- Integrar Monaco Editor.
- Crear panel de codigo.
- Crear boton "Generar".
- Parsear codigo simple.

### Paso 4: parser MVP

Soportar entradas simples:

```text
@startuml
class Usuario
class Pedido
Usuario --> Pedido
@enduml
```

Resultado:

- Nodos: Usuario, Pedido.
- Relacion: Usuario hacia Pedido.

### Paso 5: estilos

- Cambiar color de nodo.
- Cambiar color de borde.
- Cambiar color de texto.
- Cambiar fondo del lienzo.
- Guardar tema.

### Paso 6: exportacion

- Exportar JSON.
- Exportar PNG.
- Exportar SVG.

### Paso 7: guardado local

- Guardar en localStorage.
- Importar archivo JSON.
- Exportar archivo JSON.

## 14. Que no instalar al inicio

Para no hacer pesado el MVP, no conviene instalar todavia:

- NestJS.
- Prisma.
- Socket.IO.
- Yjs.
- Librerias grandes de IA.
- Autenticacion.
- Base de datos.
- Sistema de pagos.
- Colaboracion en tiempo real.

Estas piezas se agregaran cuando el producto ya tenga un editor visual funcional.

## 15. Comandos iniciales sugeridos

Crear el proyecto:

```bash
pnpm create vite uml-visual-studio --template react-ts
```

Entrar al proyecto:

```bash
cd uml-visual-studio
```

Instalar dependencias principales:

```bash
pnpm add @xyflow/react monaco-editor zustand zod lucide-react html-to-image jspdf
```

Instalar dependencias de desarrollo:

```bash
pnpm add -D tailwindcss vite typescript vitest playwright eslint prettier
```

Instalar dependencias futuras solo cuando se necesiten:

```bash
pnpm add dagre elkjs mermaid plantuml-encoder
```

## 16. Recomendacion de versiones fijas o rangos

Para el desarrollo inicial se recomienda fijar versiones en `package.json`.

Ejemplo:

```json
"react": "19.2.7"
```

En lugar de:

```json
"react": "^19.2.7"
```

Motivo:

- Evita cambios inesperados.
- Hace mas facil depurar errores.
- Permite que todos trabajen con las mismas dependencias.

Cuando el proyecto sea estable, se pueden actualizar dependencias de forma controlada.

## 17. Recomendacion final de arquitectura

La arquitectura mas conveniente para empezar es:

```text
Frontend primero
  React + TypeScript + Vite

Editor visual
  React Flow

Editor de codigo
  Monaco Editor

Estado
  Zustand

Validacion
  Zod

Estilos
  Tailwind CSS

Exportacion
  html-to-image + jsPDF

Pruebas
  Vitest + Playwright
```

Backend, base de datos, colaboracion e IA deben quedar como fases futuras.

## 18. Fuentes de referencia

- React: https://www.npmjs.com/package/react
- Vite: https://www.npmjs.com/package/vite
- TypeScript: https://www.npmjs.com/package/typescript
- React Flow: https://www.npmjs.com/package/@xyflow/react
- Monaco Editor: https://www.npmjs.com/package/monaco-editor
- Zustand: https://www.npmjs.com/package/zustand
- Tailwind CSS: https://www.npmjs.com/package/tailwindcss
- Lucide React: https://www.npmjs.com/package/lucide-react
- Zod: https://www.npmjs.com/package/zod
- Vitest: https://www.npmjs.com/package/vitest
- Playwright: https://www.npmjs.com/package/playwright
- ESLint: https://www.npmjs.com/package/eslint
- Prettier: https://www.npmjs.com/package/prettier
- NestJS: https://www.npmjs.com/package/@nestjs/core
- Prisma: https://www.npmjs.com/package/prisma
- Socket.IO: https://www.npmjs.com/package/socket.io
- Yjs: https://www.npmjs.com/package/yjs
- Mermaid: https://www.npmjs.com/package/mermaid
- Node.js releases: https://nodejs.org/en/about/previous-releases
