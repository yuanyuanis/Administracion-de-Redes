 Test — Unidad 1: Conceptos y Arquitectura VLAN

## Administración de Redes | 10 Preguntas de Evaluación

---

### Pregunta 1

En un switch con las VLANs 10, 20 y 30 configuradas, un administrador borra el archivo `startup-config` y reinicia el switch. ¿Qué ocurre con las VLANs?

- **a)** Las VLANs se eliminan porque toda la configuración se borra al reiniciar.
- **b)** Las VLANs se mantienen porque se almacenan en el archivo `vlan.dat`, independiente del `startup-config`.
- **c)** Solo se mantiene la VLAN 1 (nativa) y las demás se eliminan.
- **d)** Las VLANs se mantienen pero todos los puertos pasan a la VLAN 1.

---

### Pregunta 2

Un switch tiene los puertos Fa0/1 a Fa0/10 en la VLAN 10 y los puertos Fa0/11 a Fa0/20 en la VLAN 20. Un PC en el puerto Fa0/3 envía una trama broadcast. ¿Qué puertos la reciben?

- **a)** Todos los puertos del switch (Fa0/1 a Fa0/24), ya que el broadcast llega a todas partes.
- **b)** Solo los puertos Fa0/1 a Fa0/10, porque el broadcast queda confinado a la VLAN 10.
- **c)** Los puertos Fa0/1 a Fa0/10 y también cualquier puerto trunk que exista.
- **d)** Solo los puertos Fa0/1 a Fa0/10, excluyendo el puerto Fa0/3 de origen.

---

### Pregunta 3

Un administrador conecta dos switches mediante un enlace trunk. El Switch A tiene configuradas las VLANs 10, 20 y 30, pero el Switch B solo tiene configuradas las VLANs 10 y 20. ¿Qué ocurre con el tráfico de la VLAN 30 que llega al Switch B por el trunk?

- **a)** El Switch B reenvía el tráfico de la VLAN 30 por todos sus puertos como tráfico desconocido.
- **b)** El Switch B crea automáticamente la VLAN 30 al recibir tráfico etiquetado con ese ID.
- **c)** El tráfico de la VLAN 30 se descarta en el Switch B porque la VLAN no existe localmente.
- **d)** El enlace trunk se desactiva por inconsistencia de VLANs entre ambos switches.

---

### Pregunta 4

¿Cuál es la razón principal por la que usar un cable físico dedicado por cada VLAN entre switches es inviable en redes empresariales?

- **a)** Porque los cables físicos no pueden transportar tráfico de VLAN, solo tráfico sin etiquetar.
- **b)** Porque consumiría un puerto por cada VLAN en cada switch, no escala con muchas VLANs y switches, y es costoso.
- **c)** Porque el estándar IEEE 802.1Q prohíbe explícitamente esta configuración.
- **d)** Porque el tráfico de distintas VLANs se mezclaría en los cables al llegar al segundo switch.

---

### Pregunta 5

Un técnico conecta directamente con un cable cruzado un puerto de la VLAN 30 con un puerto de la VLAN 40 en el mismo switch, sin pasar por un router. ¿Cuál es la consecuencia?

- **a)** Los equipos de ambas VLANs pueden comunicarse correctamente a nivel IP.
- **b)** Se fusionan los dominios de difusión de ambas VLANs, deshaciendo la segmentación y provocando flooding.
- **c)** El switch detecta el bucle y STP bloquea uno de los puertos automáticamente.
- **d)** No ocurre nada porque el switch impide la comunicación entre VLANs distintas a nivel físico.

---

### Pregunta 6

En el proceso de etiquetado 802.1Q a través de un enlace trunk, ¿en qué momento exacto se añade y se elimina la etiqueta de VLAN?

- **a)** El PC emisor añade la etiqueta y el PC receptor la elimina.
- **b)** La etiqueta se añade al entrar al switch de origen y nunca se elimina; el PC final la procesa.
- **c)** El switch de origen añade la etiqueta al enviar la trama por el trunk, y el switch receptor la elimina antes de entregarla al puerto de acceso del destino.
- **d)** La etiqueta se añade en el router y se elimina en el switch de destino.

---

### Pregunta 7

Para que dos VLANs distintas puedan comunicarse entre sí, ¿qué condiciones deben cumplirse simultáneamente?

- **a)** Basta con que ambas VLANs estén en el mismo switch y se configure un trunk entre sus puertos.
- **b)** Se necesita un dispositivo de Nivel 3 (router o switch L3) y que cada VLAN tenga asignada una subred IP diferente.
- **c)** Es suficiente con asignar la misma subred IP a ambas VLANs y conectarlas por un hub.
- **d)** Se necesita únicamente un enlace trunk entre los switches que contienen cada VLAN.

---

### Pregunta 8

Un switch tiene 3 VLANs configuradas (10, 20, 30) y un puerto trunk hacia otro switch. ¿Cuántos dominios de broadcast existen en ese switch?

- **a)** 1, porque físicamente es un solo switch.
- **b)** 2: uno para las VLANs y otro para el tráfico trunk.
- **c)** 3, uno por cada VLAN configurada (sin contar la VLAN 1 si no tiene puertos asignados activos).
- **d)** 4, uno por cada VLAN más uno para el enlace trunk.

---

### Pregunta 9

Un administrador observa que un equipo recién conectado al puerto Fa0/5 no puede comunicarse con ningún dispositivo de la red, aunque el puerto está activo y el enlace funciona físicamente. El puerto no tiene VLAN asignada explícitamente. ¿Cuál es la causa más probable?

- **a)** El puerto está en la VLAN 1 por defecto y los demás dispositivos están en otras VLANs, por lo que no comparten dominio de broadcast.
- **b)** El switch ha desactivado el puerto por seguridad al detectar un dispositivo desconocido.
- **c)** El equipo necesita un driver especial para funcionar con VLANs.
- **d)** El puerto está configurado como trunk y descarta el tráfico sin etiquetar del equipo.

---

### Pregunta 10

¿En qué capa del modelo OSI operan respectivamente las VLANs, los puertos trunk y el enrutamiento inter-VLAN?

- **a)** VLANs en capa 1, trunks en capa 2, enrutamiento en capa 3.
- **b)** VLANs en capa 2, trunks en capa 3, enrutamiento en capa 4.
- **c)** VLANs en capa 2, trunks en capa 2, enrutamiento en capa 3.
- **d)** VLANs en capa 3, trunks en capa 2, enrutamiento en capa 3.

---

---

## Soluciones Justificadas

### 1. Respuesta correcta: **b)**

Las VLANs se almacenan en el archivo `vlan.dat`, que es independiente del `startup-config`. Borrar el startup-config elimina la configuración de interfaces y otros parámetros, pero el `vlan.dat` persiste en la memoria flash. Por eso las VLANs se mantienen. La opción **a)** es incorrecta porque confunde ambos archivos. La opción **d)** es parcialmente engañosa: los puertos mantienen su asignación de VLAN porque esa info está en el startup-config, pero como se borró, sí volverían a VLAN 1; sin embargo las VLANs en sí siguen existiendo en el `vlan.dat`. La opción **c)** es incorrecta porque todas las VLANs persisten, no solo la 1.

---

### 2. Respuesta correcta: **c)**

El broadcast queda confinado dentro de la VLAN 10, por lo que lo reciben los puertos Fa0/1 a Fa0/10. Pero un detalle crucial es que los puertos trunk también transportan el broadcast, ya que el trunk pertenece a todas las VLANs. La opción **b)** sería correcta solo si no existiesen puertos trunk. La opción **a)** es incorrecta porque las VLANs precisamente impiden que el broadcast llegue a otras VLANs. La opción **d)** es incorrecta: el puerto de origen sí recibe su propio broadcast en algunos escenarios, pero lo importante es que el trunk también lo recibe.

---

### 3. Respuesta correcta: **c)**

Si una VLAN no está creada localmente en un switch, el tráfico etiquetado con esa VLAN que llega por el trunk se descarta. El switch no crea VLANs automáticamente al recibir tráfico (opción **b** incorrecta). El trunk no se desactiva por esta inconsistencia (opción **d** incorrecta). Tampoco se reenvía como tráfico desconocido (opción **a** incorrecta), ya que el switch simplemente descarta lo que no reconoce como VLAN local.

---

### 4. Respuesta correcta: **b)**

La inviabilidad es práctica: con muchas VLANs y switches, se necesitaría un cable (y un puerto) por cada VLAN entre cada par de switches, agotando puertos e incrementando costes exponencialmente. La opción **a)** es incorrecta porque los cables sí pueden transportar tráfico de VLAN (eso es lo que hace un trunk). La opción **c)** es falsa: 802.1Q no prohíbe nada de esto, simplemente ofrece una solución mejor. La opción **d)** es incorrecta porque si cada cable está asignado a una sola VLAN, no hay mezcla.

---

### 5. Respuesta correcta: **b)**

Al conectar directamente puertos de VLANs distintas a través de un dispositivo de capa 1 o un cable directo, se están uniendo los dominios de difusión de ambas VLANs. Esto provoca flooding y destruye la segmentación. La opción **a)** es incorrecta porque aunque haya conectividad a nivel 2, no hay enrutamiento IP controlado. La opción **c)** es incorrecta porque STP protege contra bucles entre switches, no contra este tipo de error de configuración. La opción **d)** es incorrecta porque el switch no impide esto a nivel físico; el error de diseño tiene consecuencias reales.

---

### 6. Respuesta correcta: **c)**

El proceso 802.1Q funciona así: el switch de origen inserta la etiqueta VLAN cuando la trama sale por un puerto trunk. El switch receptor lee la etiqueta para saber a qué VLAN pertenece y la elimina antes de reenviar la trama por el puerto de acceso hacia el dispositivo final. El PC nunca ve la etiqueta. La opción **a)** es incorrecta porque los PCs no manejan etiquetas 802.1Q (salvo configuraciones muy específicas). La opción **b)** es incorrecta porque la etiqueta siempre se elimina antes de llegar al dispositivo final. La opción **d)** es incorrecta porque el router no interviene en el etiquetado trunk (salvo en router-on-a-stick, donde sí procesa tags, pero no es él quien los "añade" en el sentido del flujo normal).

---

### 7. Respuesta correcta: **b)**

La comunicación inter-VLAN requiere dos cosas: un dispositivo de Nivel 3 que pueda enrutar paquetes IP entre subredes, y que cada VLAN tenga una subred IP distinta (para que el router sepa hacia dónde enrutar). La opción **a)** es incorrecta porque un trunk solo transporta VLANs, no las comunica. La opción **c)** es incorrecta porque usar la misma subred en dos VLANs crea conflictos y el hub fusionaría dominios. La opción **d)** es incorrecta porque el trunk extiende VLANs entre switches pero no habilita comunicación entre ellas.

---

### 8. Respuesta correcta: **c)**

Cada VLAN crea su propio dominio de broadcast. Con 3 VLANs configuradas (10, 20, 30), hay 3 dominios de broadcast. El trunk no crea un dominio adicional; es simplemente un medio de transporte para el tráfico de todas las VLANs. La opción **a)** es incorrecta porque el propósito de las VLANs es crear múltiples dominios dentro de un solo switch físico. La opción **d)** es incorrecta porque el trunk no genera un dominio propio. Nota: si la VLAN 1 tuviera puertos activos, habría que contarla también.

---

### 9. Respuesta correcta: **a)**

Por defecto, todos los puertos no asignados explícitamente pertenecen a la VLAN 1. Si el resto de dispositivos de la red están en las VLANs 10, 20 o 30, el equipo en Fa0/5 (VLAN 1) está en un dominio de broadcast diferente y no puede comunicarse con ellos. La opción **b)** es incorrecta porque el port security requiere configuración explícita. La opción **c)** es incorrecta porque los equipos finales no necesitan drivers especiales para VLANs (el switch maneja todo). La opción **d)** es una posibilidad técnica pero menos probable que la **a)** como causa por defecto; además, en modo trunk el comportamiento depende de la VLAN nativa.

---

### 10. Respuesta correcta: **c)**

Las VLANs son un mecanismo de segmentación a nivel de **capa 2** (trabajan con tramas y direcciones MAC). Los puertos trunk también operan en **capa 2** (etiquetan tramas Ethernet con 802.1Q). El enrutamiento inter-VLAN requiere **capa 3** (trabaja con paquetes IP). La opción **a)** es incorrecta porque las VLANs no operan en capa 1 (capa física). La opción **b)** es incorrecta porque los trunks no son de capa 3. La opción **d)** es incorrecta porque las VLANs son capa 2, no capa 3.

---

*Asignatura: Administración de Redes — Ingeniería Informática (UAX)*

*Test 25/02/2026* 9/10