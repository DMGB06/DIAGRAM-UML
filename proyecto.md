# Documento general del proyecto UML Visual

## 1. Nombre provisional

Nombre provisional del proyecto: **UML Visual Studio**.

Otros nombres posibles:

- UML Canvas.
- VisualUML.
- DiagramCraft.
- Code2Diagram.
- FlowUML.
- DiagramForge.

El nombre definitivo puede elegirse despues, pero para este documento se usara **UML Visual Studio** como referencia.

## 2. Resumen del proyecto

UML Visual Studio sera una herramienta web para crear, editar, decorar, organizar y exportar diagramas UML y diagramas tecnicos.

La idea principal es combinar dos formas de trabajo:

- Crear diagramas rapidamente usando codigo tipo PlantUML, Mermaid o un formato propio.
- Editar visualmente el diagrama generado, moviendo cuadros, cambiando colores, ajustando flechas, agregando elementos y mejorando el diseno final.

El proyecto busca resolver un problema comun: muchas herramientas generan diagramas desde codigo, pero el resultado visual suele quedar rigido, desordenado o poco estetico. Esta herramienta permitira generar la base con codigo y luego perfeccionarla con un editor visual.

## 3. Objetivo principal

Crear una herramienta hibrida donde el usuario pueda:

- Escribir o pegar codigo UML.
- Generar un diagrama automaticamente.
- Editar el diagrama de forma visual.
- Mover elementos libremente.
- Cambiar estilos, colores, fondos y formas.
- Crear diagramas desde cero sin codigo.
- Generar codigo a partir del diagrama visual.
- Exportar el resultado como imagen, SVG, PDF, JSON o codigo.

El objetivo no es solo generar diagramas, sino ayudar a construir diagramas claros, presentables y faciles de modificar.

## 4. Problema que se quiere resolver

Herramientas como PlantUML permiten crear diagramas muy rapido usando texto, pero presentan algunas limitaciones:

- El orden automatico no siempre queda bien.
- Las flechas pueden cruzarse demasiado.
- Algunos cuadros quedan lejos, apretados o mal alineados.
- Personalizar el diseno puede ser lento.
- Mover un elemento especifico no siempre es facil.
- El resultado puede no ser ideal para una presentacion o documento formal.
- Si se quiere un estilo mas visual, muchas veces hay que redibujar el diagrama en otra herramienta.

UML Visual Studio resolvera esto permitiendo que el usuario mantenga la velocidad del codigo y al mismo tiempo tenga control visual sobre el resultado.

## 5. Publico objetivo

La herramienta estara pensada para:

- Estudiantes de programacion.
- Analistas de sistemas.
- Desarrolladores.
- Arquitectos de software.
- Docentes.
- Equipos de desarrollo.
- Personas que documentan proyectos.
- Personas que necesitan presentar diagramas de forma clara.

Tambien podria servir para usuarios que no conocen bien UML, porque podran crear diagramas visualmente y luego ver el codigo generado.

## 6. Valor diferencial

El valor principal sera:

```text
Generar diagramas desde codigo, editarlos visualmente y exportarlos con un acabado profesional.
```

La herramienta no sera solo un clon de PlantUML. La diferencia sera la combinacion de:

- Codigo editable.
- Diagrama interactivo.
- Personalizacion visual.
- Sincronizacion entre codigo y lienzo.
- Guardado de posiciones y estilos.
- Exportacion profesional.

## 7. Alcance general del proyecto

El proyecto incluira:

- Editor de codigo UML.
- Editor visual de diagramas.
- Renderizado automatico.
- Movimiento manual de nodos.
- Edicion de textos.
- Edicion de colores y estilos.
- Manejo de flechas y relaciones.
- Guardado de proyectos.
- Importacion y exportacion.
- Plantillas.
- Temas visuales.
- Validacion basica.
- Historial de cambios.
- Soporte progresivo para varios tipos de diagramas.

El proyecto no intentara incluir todo desde la primera version. Se construira por fases para evitar que sea demasiado grande o dificil de mantener.

## 8. Que va a incluir el proyecto

### 8.1 Editor de codigo

El proyecto incluira un editor donde el usuario pueda escribir codigo UML o codigo compatible con algun formato de diagramas.

Funciones:

- Escribir codigo manualmente.
- Pegar codigo existente.
- Resaltado de sintaxis.
- Numeracion de lineas.
- Autocompletado basico.
- Deteccion de errores.
- Formateo automatico.
- Boton para generar diagrama.
- Boton para limpiar editor.
- Boton para copiar codigo.
- Boton para descargar codigo.

### 8.2 Vista previa del diagrama

El sistema mostrara una vista del diagrama generado.

Funciones:

- Generar diagrama desde codigo.
- Actualizar la vista cuando cambie el codigo.
- Mostrar errores si el codigo no es valido.
- Permitir zoom.
- Permitir desplazamiento.
- Permitir centrar el diagrama.
- Permitir ajustar el diagrama a la pantalla.

### 8.3 Lienzo visual editable

El lienzo sera el area principal donde el usuario podra modificar el diagrama.

Funciones:

- Mover elementos.
- Seleccionar elementos.
- Redimensionar elementos.
- Cambiar texto.
- Cambiar color de relleno.
- Cambiar color de borde.
- Cambiar grosor del borde.
- Cambiar tipo de borde.
- Cambiar estilo de flechas.
- Mover puntos de conexion.
- Crear nuevas conexiones.
- Eliminar elementos.
- Duplicar elementos.
- Agrupar elementos.
- Bloquear elementos.
- Alinear elementos.
- Distribuir elementos.
- Ordenar automaticamente.
- Activar o desactivar cuadricula.
- Ajustar elementos a la cuadricula.

### 8.4 Panel de propiedades

Cuando el usuario seleccione un elemento, aparecera un panel con sus propiedades.

Propiedades posibles:

- Nombre.
- Tipo de elemento.
- Texto visible.
- Color de fondo.
- Color de borde.
- Color de texto.
- Tamano.
- Posicion X.
- Posicion Y.
- Fuente.
- Alineacion de texto.
- Nivel de capa.
- Estado bloqueado.
- Estilo visual.

Para relaciones o flechas:

- Origen.
- Destino.
- Tipo de relacion.
- Texto de la relacion.
- Direccion.
- Estilo de linea.
- Color.
- Grosor.
- Tipo de punta de flecha.

### 8.5 Panel de elementos

El proyecto incluira una barra o panel con elementos que se puedan arrastrar al lienzo.

Elementos segun el tipo de diagrama:

- Clase.
- Interfaz.
- Enum.
- Actor.
- Caso de uso.
- Paquete.
- Componente.
- Nodo.
- Base de datos.
- Servicio.
- Estado.
- Actividad.
- Decision.
- Inicio.
- Fin.
- Participante de secuencia.
- Mensaje de secuencia.
- Nota.
- Grupo.

### 8.6 Generacion de codigo desde el diagrama

El sistema debera poder generar codigo a partir del diagrama visual.

Ejemplos:

- Si se crea una clase visualmente, se agrega al codigo.
- Si se conecta una clase con otra, se agrega la relacion.
- Si se edita un nombre, se actualiza el codigo.
- Si se elimina un elemento, se elimina o comenta en el codigo.

Esto puede empezar de forma simple y mejorar con el tiempo.

### 8.7 Sincronizacion entre codigo y vista visual

El proyecto incluira una sincronizacion entre el codigo y el diagrama.

Modos posibles:

- Modo automatico: cada cambio en el codigo actualiza el diagrama.
- Modo manual: el usuario presiona "Generar" para actualizar.
- Modo visual: el usuario edita el diagrama y luego genera el codigo.
- Modo mixto: ambas vistas se mantienen conectadas.

Para evitar problemas, se guardaran metadatos visuales separados del codigo.

### 8.8 Guardado de proyectos

El sistema permitira guardar proyectos con toda su informacion.

Un proyecto guardara:

- Nombre del proyecto.
- Tipo de diagrama.
- Codigo fuente.
- Nodos.
- Relaciones.
- Posiciones.
- Estilos.
- Tema visual.
- Fecha de creacion.
- Fecha de ultima modificacion.
- Version del formato.

### 8.9 Importacion

El proyecto podra importar:

- Codigo PlantUML.
- Codigo Mermaid.
- Archivos `.puml`.
- Archivos `.mmd`.
- Archivos JSON propios del sistema.

En fases futuras podria importar:

- Diagramas exportados desde otras herramientas.
- Archivos de arquitectura.
- Codigo fuente de proyectos.

### 8.10 Exportacion

El proyecto podra exportar:

- PNG.
- SVG.
- PDF.
- JSON del proyecto.
- Codigo PlantUML.
- Codigo Mermaid.
- Imagen con fondo transparente.
- Imagen con fondo personalizado.

Opciones de exportacion:

- Exportar todo el lienzo.
- Exportar solo seleccion.
- Exportar con fondo.
- Exportar sin fondo.
- Exportar en alta resolucion.

### 8.11 Plantillas

El sistema incluira plantillas para empezar rapido.

Plantillas iniciales:

- Sistema de login.
- Sistema de ventas.
- Carrito de compras.
- Sistema escolar.
- Gestion de inventario.
- API REST.
- Microservicios.
- Arquitectura cliente-servidor.
- Diagrama de clases CRUD.
- Diagrama de secuencia de autenticacion.
- Casos de uso para una tienda virtual.

Cada plantilla tendra:

- Nombre.
- Descripcion breve.
- Tipo de diagrama.
- Codigo inicial.
- Diagrama generado.
- Estilo visual recomendado.

### 8.12 Temas visuales

El proyecto incluira temas listos para usar.

Temas posibles:

- Claro profesional.
- Oscuro profesional.
- Academico.
- Minimalista.
- Presentacion.
- Arquitectura.
- Colorido moderado.
- Blanco y negro.

El usuario tambien podra crear y guardar sus propios estilos.

### 8.13 Fondos

El usuario podra cambiar el fondo del lienzo.

Opciones:

- Fondo blanco.
- Fondo oscuro.
- Fondo cuadriculado.
- Fondo punteado.
- Fondo transparente.
- Fondo con color personalizado.
- Fondo con imagen, en una fase futura.

### 8.14 Ordenamiento automatico

El sistema tendra herramientas para ordenar automaticamente el diagrama.

Opciones:

- Ordenar de arriba hacia abajo.
- Ordenar de izquierda a derecha.
- Ordenar por jerarquia.
- Ordenar por paquetes.
- Ordenar circularmente.
- Reducir cruces de flechas.
- Separar elementos solapados.
- Centrar diagrama.
- Distribuir horizontalmente.
- Distribuir verticalmente.

### 8.15 Validacion

El sistema validara errores basicos.

Validaciones posibles:

- Codigo con sintaxis incorrecta.
- Elementos sin nombre.
- Relaciones sin origen o destino.
- Clases duplicadas.
- Actores sin casos de uso.
- Participantes de secuencia sin mensajes.
- Paquetes vacios.
- Relaciones no compatibles con el tipo de diagrama.

### 8.16 Historial

El usuario podra deshacer y rehacer acciones.

Acciones del historial:

- Mover elemento.
- Cambiar color.
- Cambiar texto.
- Crear elemento.
- Eliminar elemento.
- Crear relacion.
- Cambiar estilo.
- Aplicar layout automatico.

En fases futuras se podra agregar historial de versiones guardadas.

### 8.17 Busqueda dentro del diagrama

El sistema incluira busqueda para diagramas grandes.

Funciones:

- Buscar por nombre.
- Buscar por tipo.
- Buscar por texto.
- Resaltar resultados.
- Centrar el elemento encontrado.

### 8.18 Notas y comentarios

El usuario podra agregar notas al diagrama.

Funciones:

- Nota simple.
- Nota conectada a un elemento.
- Comentario interno.
- Marcador de pendiente.
- Observacion para documentacion.

### 8.19 Capas

El sistema podra permitir organizar elementos por capas.

Ejemplos:

- Capa de entidades.
- Capa de servicios.
- Capa de base de datos.
- Capa de infraestructura.
- Capa de comentarios.
- Capa de decoracion.

Las capas podran ocultarse, mostrarse o bloquearse.

## 9. Tipos de diagramas que tendra

### 9.1 Primera version

Para la primera version se recomienda incluir:

- Diagrama de clases.

Motivo:

- Es uno de los diagramas UML mas usados.
- Es mas facil de convertir a nodos y relaciones editables.
- Permite construir una base solida para otros tipos de diagramas.

### 9.2 Segunda etapa

Luego se pueden incluir:

- Diagrama de secuencia.
- Diagrama de casos de uso.
- Diagrama de paquetes.

### 9.3 Tercera etapa

Despues se pueden incluir:

- Diagrama de actividades.
- Diagrama de estados.
- Diagrama de componentes.
- Diagrama de despliegue.
- Diagrama de objetos.

### 9.4 Diagramas extra futuros

Tambien se podrian incluir:

- Diagrama de flujo.
- Diagrama entidad-relacion.
- Diagrama C4.
- Diagrama de arquitectura.
- Mapa de dependencias.
- Diagrama de carpetas de un proyecto.
- Diagrama personalizado.

## 10. Que no va a incluir inicialmente

Para mantener el proyecto controlado, la primera version no deberia incluir:

- Colaboracion en tiempo real.
- Inteligencia artificial completa.
- Soporte completo para todos los diagramas UML.
- Importacion perfecta de cualquier sintaxis PlantUML.
- Editor avanzado de imagenes.
- Animaciones complejas.
- Control de usuarios empresariales.
- Integracion con GitHub.
- Analisis automatico de proyectos grandes.
- Marketplace de plantillas.
- Aplicacion movil nativa.
- Edicion offline avanzada.

Estas funciones pueden dejarse para fases futuras.

## 11. Cosas que el proyecto no busca ser

El proyecto no busca ser:

- Un reemplazo total de PlantUML desde el primer dia.
- Una herramienta CAD.
- Un editor grafico general como Photoshop o Illustrator.
- Un sistema de modelado empresarial completo.
- Una plataforma de gestion de proyectos.
- Un compilador UML perfecto.
- Una herramienta exclusiva para expertos.

El enfoque sera crear diagramas tecnicos de forma rapida, visual y flexible.

## 12. Flujo principal de usuario

Flujo desde codigo:

1. El usuario abre la herramienta.
2. Selecciona el tipo de diagrama.
3. Pega o escribe codigo UML.
4. Presiona "Generar".
5. El sistema interpreta el codigo.
6. Se genera el diagrama en el lienzo.
7. El usuario mueve elementos.
8. El usuario cambia estilos.
9. El usuario corrige flechas o cruces.
10. El usuario guarda el proyecto.
11. El usuario exporta el resultado.

Flujo desde editor visual:

1. El usuario abre un proyecto nuevo.
2. Selecciona el tipo de diagrama.
3. Arrastra elementos al lienzo.
4. Conecta elementos.
5. Edita nombres y propiedades.
6. El sistema genera el codigo.
7. El usuario ajusta el diseno.
8. El usuario exporta o guarda.

Flujo mixto:

1. El usuario genera un diagrama desde codigo.
2. Ajusta elementos visualmente.
3. Agrega nuevos elementos desde el lienzo.
4. El sistema actualiza el codigo.
5. El usuario sigue editando codigo o vista visual.

## 13. Pantallas principales

### 13.1 Pantalla de inicio

Contenido:

- Lista de proyectos recientes.
- Boton para crear proyecto nuevo.
- Boton para importar archivo.
- Plantillas destacadas.
- Acceso a configuracion.

### 13.2 Pantalla de nuevo proyecto

Contenido:

- Nombre del proyecto.
- Tipo de diagrama.
- Plantilla inicial.
- Tema visual.
- Opcion de iniciar desde codigo o desde lienzo.

### 13.3 Editor principal

Contenido:

- Barra superior con acciones generales.
- Panel izquierdo con elementos y estructura.
- Lienzo central.
- Panel derecho con propiedades.
- Editor de codigo en panel inferior o lateral.
- Barra de estado con errores, zoom y coordenadas.

### 13.4 Pantalla de exportacion

Contenido:

- Formato de salida.
- Calidad.
- Fondo.
- Area a exportar.
- Vista previa.
- Boton de descarga.

### 13.5 Pantalla de configuracion

Contenido:

- Tema de la aplicacion.
- Preferencias del editor.
- Preferencias del lienzo.
- Atajos de teclado.
- Formato de exportacion por defecto.

## 14. Componentes principales del sistema

### 14.1 Frontend

Responsable de:

- Interfaz visual.
- Editor de codigo.
- Lienzo interactivo.
- Paneles de propiedades.
- Manejo de acciones del usuario.
- Exportacion visual.

Tecnologias posibles:

- React.
- TypeScript.
- React Flow o Konva.
- Monaco Editor o CodeMirror.
- Zustand, Redux o Context para estado.

### 14.2 Motor de diagramas

Responsable de:

- Leer el codigo.
- Convertirlo a modelo interno.
- Generar nodos y relaciones.
- Validar errores.
- Aplicar layouts.
- Convertir el modelo a codigo.

### 14.3 Modelo interno

El sistema no debe depender solo de una imagen. Debe tener un modelo propio.

Ejemplo:

```json
{
  "id": "project-001",
  "name": "Sistema de ventas",
  "diagramType": "class",
  "sourceType": "plantuml",
  "source": "@startuml\nclass Usuario\nclass Pedido\nUsuario --> Pedido\n@enduml",
  "nodes": [
    {
      "id": "usuario",
      "type": "class",
      "name": "Usuario",
      "position": { "x": 120, "y": 100 },
      "size": { "width": 180, "height": 120 },
      "style": {
        "fill": "#ffffff",
        "stroke": "#222222",
        "text": "#111111"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-001",
      "source": "usuario",
      "target": "pedido",
      "type": "association",
      "label": ""
    }
  ],
  "theme": {},
  "metadata": {
    "createdAt": "2026-06-21",
    "updatedAt": "2026-06-21",
    "version": "1.0.0"
  }
}
```

### 14.4 Backend

El backend puede ser opcional en la primera version si todo funciona localmente en el navegador.

Cuando se agregue backend, servira para:

- Guardar proyectos en base de datos.
- Manejar usuarios.
- Compartir diagramas.
- Colaboracion en tiempo real.
- Renderizado pesado.
- Integraciones externas.

Tecnologias posibles:

- Node.js con Express o NestJS.
- PostgreSQL.
- SQLite para version local.
- WebSockets para colaboracion.

## 15. Estructura sugerida del proyecto

Una estructura posible seria:

```text
uml-visual-studio/
  docs/
    proyecto.md
    ideas.md
    arquitectura.md
    roadmap.md
  src/
    app/
      pages/
      routes/
      layout/
    components/
      editor/
      canvas/
      panels/
      toolbar/
      modals/
    diagram/
      parser/
      renderer/
      layout/
      exporters/
      importers/
      validators/
      generators/
    store/
    styles/
    utils/
    types/
  public/
    templates/
    icons/
    samples/
  tests/
    parser/
    renderer/
    integration/
  package.json
  README.md
```

## 16. Modulos funcionales

### 16.1 Modulo de proyectos

Funciones:

- Crear proyecto.
- Abrir proyecto.
- Guardar proyecto.
- Duplicar proyecto.
- Eliminar proyecto.
- Renombrar proyecto.
- Ver proyectos recientes.

### 16.2 Modulo de editor de codigo

Funciones:

- Escribir codigo.
- Resaltar sintaxis.
- Validar sintaxis.
- Formatear codigo.
- Generar diagrama.
- Copiar codigo.
- Descargar codigo.

### 16.3 Modulo de lienzo

Funciones:

- Mostrar nodos y relaciones.
- Seleccionar elementos.
- Mover elementos.
- Redimensionar elementos.
- Zoom.
- Pan.
- Cuadricula.
- Guias.
- Ajuste automatico.

### 16.4 Modulo de estilos

Funciones:

- Cambiar tema.
- Cambiar colores.
- Cambiar tipografia.
- Guardar preset.
- Aplicar estilos a seleccion.
- Aplicar estilos globales.

### 16.5 Modulo de importacion

Funciones:

- Importar PlantUML.
- Importar Mermaid.
- Importar JSON propio.
- Leer archivos.
- Detectar tipo de diagrama.

### 16.6 Modulo de exportacion

Funciones:

- Exportar PNG.
- Exportar SVG.
- Exportar PDF.
- Exportar JSON.
- Exportar PlantUML.
- Exportar Mermaid.

### 16.7 Modulo de layout

Funciones:

- Ordenar automaticamente.
- Reducir cruces.
- Separar nodos.
- Centrar diagrama.
- Mantener posiciones manuales.

### 16.8 Modulo de validacion

Funciones:

- Validar codigo.
- Validar relaciones.
- Validar nodos.
- Mostrar errores.
- Sugerir correcciones.

## 17. Reglas importantes del sistema

Reglas recomendadas:

- El diagrama debe tener un modelo interno propio.
- El codigo no debe ser la unica fuente de verdad.
- Las posiciones manuales deben conservarse.
- El usuario debe poder volver al codigo original.
- Los cambios visuales deben poder guardarse.
- El sistema debe avisar antes de sobrescribir cambios visuales.
- La primera version debe ser simple pero estable.
- Los diagramas grandes deben seguir siendo navegables.
- El usuario debe poder exportar aunque no tenga cuenta.

## 18. Decisiones tecnicas recomendadas

Recomendacion inicial:

- Frontend: React con TypeScript.
- Lienzo: React Flow para nodos y conexiones.
- Editor de codigo: Monaco Editor.
- Estado: Zustand.
- Exportacion: SVG/PNG desde el lienzo.
- Persistencia inicial: localStorage o archivos JSON.
- Parser inicial: parser propio simple para diagramas de clases o adaptador para Mermaid/PlantUML.

Motivo:

- React Flow facilita mover nodos y manejar conexiones.
- Monaco Editor da una experiencia similar a VS Code.
- TypeScript ayuda a controlar mejor los tipos de nodos y relaciones.
- Empezar con almacenamiento local reduce complejidad.

## 19. Fases de desarrollo

### Fase 1: MVP basico

Objetivo:

Crear una version minima que demuestre la idea.

Incluye:

- Crear proyecto.
- Editor de codigo.
- Soporte para diagrama de clases simple.
- Generar nodos y relaciones.
- Mostrar diagrama en lienzo.
- Mover nodos.
- Guardar posiciones.
- Cambiar colores basicos.
- Exportar PNG o SVG.

No incluye:

- Multiples usuarios.
- Todos los diagramas UML.
- IA.
- Colaboracion.
- Backend completo.

### Fase 2: editor visual completo

Incluye:

- Crear elementos desde el lienzo.
- Crear relaciones visualmente.
- Editar nombres.
- Panel de propiedades.
- Temas visuales.
- Fondo cuadriculado.
- Alineacion y distribucion.
- Deshacer y rehacer.

### Fase 3: sincronizacion avanzada

Incluye:

- Generar codigo desde diagrama.
- Actualizar codigo al editar visualmente.
- Mantener metadatos visuales.
- Detectar conflictos entre codigo y vista.
- Mejorar parser.

### Fase 4: mas tipos de diagramas

Incluye:

- Diagrama de secuencia.
- Diagrama de casos de uso.
- Diagrama de paquetes.
- Diagrama de actividades.
- Plantillas por tipo.
- Validaciones especificas.

### Fase 5: funciones profesionales

Incluye:

- Versionado.
- Comentarios.
- Capas.
- Modo presentacion.
- Exportacion PDF avanzada.
- Compartir enlace.
- Guardado en nube.

### Fase 6: funciones inteligentes

Incluye:

- Generar diagramas desde texto natural.
- Explicar diagramas.
- Sugerir mejoras.
- Detectar errores semanticos.
- Generar diagramas desde codigo fuente.

## 20. Funciones futuras posibles

Ideas para implementar despues:

- Colaboracion en tiempo real.
- Modo profesor para explicar diagramas.
- Modo estudiante con ejercicios.
- Marketplace de plantillas.
- Integracion con GitHub.
- Extension para VS Code.
- Aplicacion de escritorio.
- Generacion automatica desde repositorios.
- Comparacion entre versiones.
- Comentarios por equipo.
- Exportacion a documentacion Markdown.
- Integracion con Notion, Confluence o Jira.
- Modo presentacion animado.
- Diagramas interactivos navegables.
- IA para mejorar estetica del diagrama.
- IA para elegir colores segun tipo de proyecto.
- IA para convertir historias de usuario en diagramas.

## 21. Riesgos del proyecto

Riesgos tecnicos:

- Sincronizar codigo y lienzo puede ser complejo.
- PlantUML tiene muchas sintaxis y no todas seran faciles de interpretar.
- Algunos diagramas son muy diferentes entre si.
- El layout automatico puede ser dificil de controlar.
- Diagramas grandes pueden afectar el rendimiento.

Riesgos de producto:

- Intentar incluir demasiadas funciones desde el inicio.
- Hacer una interfaz complicada.
- No definir bien el formato interno.
- Depender demasiado de una herramienta externa.
- No diferenciarse lo suficiente de herramientas existentes.

Como reducir riesgos:

- Empezar con diagrama de clases.
- Crear un modelo interno claro.
- Mantener el MVP pequeno.
- Validar primero el flujo codigo a diagrama y edicion visual.
- Agregar los demas diagramas despues.

## 22. Requisitos no funcionales

El sistema debe ser:

- Rapido para diagramas pequenos y medianos.
- Facil de usar.
- Visualmente claro.
- Compatible con navegadores modernos.
- Modular.
- Escalable.
- Mantenible.
- Exportable.
- Recuperable ante errores.

Tambien deberia:

- Guardar cambios automaticamente.
- Evitar perdida de trabajo.
- Mostrar mensajes de error claros.
- Funcionar sin configuracion compleja.

## 23. Criterios de exito del MVP

El MVP sera exitoso si permite:

- Escribir codigo simple de diagrama de clases.
- Generar un diagrama visual.
- Mover las clases libremente.
- Cambiar colores.
- Guardar el proyecto.
- Reabrir el proyecto con las posiciones guardadas.
- Exportar el resultado como imagen.

Con eso ya se demostraria la idea principal.

## 24. Ejemplo de caso de uso

Entrada del usuario:

```text
@startuml
class Usuario
class Pedido
class Producto
Usuario --> Pedido
Pedido --> Producto
@enduml
```

Resultado esperado:

- El sistema detecta tres clases.
- Crea tres nodos visuales.
- Crea dos relaciones.
- Muestra el diagrama en el lienzo.
- El usuario mueve las clases.
- El usuario cambia el color de `Usuario`.
- El sistema guarda la posicion y el color.
- El usuario exporta el diagrama a PNG.

## 25. Ejemplo de archivo de proyecto

```json
{
  "name": "Sistema de ventas",
  "diagramType": "class",
  "sourceFormat": "plantuml",
  "source": "@startuml\nclass Usuario\nclass Pedido\nUsuario --> Pedido\n@enduml",
  "nodes": [
    {
      "id": "Usuario",
      "type": "class",
      "label": "Usuario",
      "position": { "x": 100, "y": 120 },
      "style": {
        "fill": "#e8f1ff",
        "stroke": "#2f5d9f",
        "text": "#111827"
      }
    },
    {
      "id": "Pedido",
      "type": "class",
      "label": "Pedido",
      "position": { "x": 420, "y": 120 },
      "style": {
        "fill": "#fff7df",
        "stroke": "#a86b00",
        "text": "#111827"
      }
    }
  ],
  "edges": [
    {
      "id": "Usuario-Pedido",
      "source": "Usuario",
      "target": "Pedido",
      "type": "association",
      "label": ""
    }
  ],
  "canvas": {
    "background": "grid",
    "zoom": 1
  }
}
```

## 26. Conclusion

UML Visual Studio sera una herramienta para crear diagramas tecnicos combinando codigo y edicion visual.

La idea central es que el usuario no tenga que elegir entre escribir rapido o disenar bonito. Podra hacer ambas cosas: generar el diagrama desde codigo y despues acomodarlo, decorarlo y exportarlo de forma profesional.

La mejor estrategia es empezar con una version pequena pero bien hecha: diagrama de clases, editor de codigo, lienzo editable, guardado de posiciones, estilos basicos y exportacion. Luego se podran agregar mas tipos de diagramas, sincronizacion avanzada, plantillas, colaboracion e inteligencia artificial.
