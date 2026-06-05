# Proyecto Integrador I

## Aplicacion-Caprocam

### Estructura de ramas:

main
└── develop
    ├── team1
    ├── team2
    ├── team3
    ├── team4
    ├── team5
    └── team6

### Workflow:

Rama personal
→ Rama Team#
→ Develop
→ Main

### Reglas de Integracion:
1. No se realizan pushes directos a main.
2. No se realizan pushes directos a develop.
3. Todo cambio debe ingresar mediante Pull Request.
4. Todo Pull Request debe ser revisado antes de integrarse.
5. El responsable del repositorio puede solicitar cambios antes de aprobar un PR.

### Convencion de Commits:
Los siguientes ejemplos son presentados para ayudar a guiar los nombres de los commits y establecer un estandar claro.
#### feat: agrega formulario de login
Se utiliza para cambios exclusivos de agregar codigo o funcionalidades nuevas
#### fix: corrige error de validacion
Se utiliza para cambios exclusivos de correccion de codigo ya existente
#### docs: actualiza README
Se utiliza para cambios exclusivos de documentacion.
#### refactor: reorganiza componentes
Se utiliza para cambios exclusivos de reorganizacion

### Reglas para las ramas:
1. Toda rama tiene que tener la estructura de: team#-nombre-feature. Donde # y nombre representan el numero del equipo y el
nombre de cada uno, mientras que feature representa en que estan trabajando. Ejemplo: team1-marco-boton-login
2. Toda rama nueva debe crearse a partir de la rama personal activa del desarrollador o de la rama de equipo correspondiente.
Ejemplo: Marco trabaja en el equipo 1, por lo que solo puede crear ramas en el equipo1.
3. Al haber terminado el sprint o el entregable semanal, toda rama personal debe eliminarse. Esto para mantener el repositorio
lo mas limpio y ordenado posible.

### Como crear un Pull Request (PR) en github:
1. En la pagina del repositorio en github seleccionar la pestaña de "Pull requests"
2. Seleccionar el boton que dice "New pull request"
3. Asignar en el lado izquierdo la rama a la que van a subir los cambios
4. Asignar en el lado derecho la rama desde la que se van a enviar los cambios
5. Verificar titulo y descripcion del PR segun lo establecido en la plantilla
6. Verificar que el codigo que se esta enviando sea el correcto
7. Formalizar el PR

### Como crear un Pull Request (PR) en gitkraken:
1. En gitkraken seleccionar el boton de "Actions" y buscar: "Start Pull requests"
2. Asegurarse que el Pull Request se este creando con github seleccionado
3. Asignar en el lado derecho la rama a la que van a subir los cambios
4. Asignar en el lado izquierdo la rama desde la que se van a enviar los cambios
5. Verificar titulo y descripcion del PR segun lo establecido en la plantilla
6. Verificar que el codigo que se esta enviando sea el correcto
7. Formalizar el PR

### Plantilla para los Pull Request:

#### Descripcion:

Que hace este pull request? Es decir que funcion viene aqui?

#### Cambios:

Cambio 1

Cambio 2

Etc

#### Pruebas:

Como se probo el contenido que viene en el PR?

#### Capturas de pantalla:

(Solo si existen, aunque no son un mal añadido)

#### Equipo encargado:

Equipo #:

Funcion o componente asignado:
