# Tema 5 — Enrutamiento entre redes

## 0. Idea central del tema

El **routing** o **enrutamiento** es el proceso por el que un router decide por dónde enviar un paquete IP para que llegue a una red distinta de la red origen.

Un PC normalmente solo sabe dos cosas:

- comunicarse con equipos de su propia red local;
- enviar todo lo demás a su **gateway** o puerta de enlace.

El **router** es quien conecta redes diferentes y decide el siguiente salto.

---

## 1. Conceptos básicos que hay que entender antes de tocar comandos

### 1.1 Red, subred y máscara

Una dirección IP no se interpreta sola. Siempre va acompañada de una **máscara**.

Ejemplo:

```text
190.146.100.0/27
Máscara: 255.255.255.224
```

Una red `/27` tiene 32 direcciones:

- 1 dirección de red;
- 30 direcciones utilizables para hosts;
- 1 dirección de broadcast.

Por eso se dice que una `/27` permite **hasta 30 hosts reales**.

Ejemplo de división:

| Grupo | Subred | Rango útil aproximado |
|---|---|---|
| G1 | 190.146.100.0/27 | 190.146.100.1 – 190.146.100.30 |
| G2 | 190.146.100.32/27 | 190.146.100.33 – 190.146.100.62 |
| G3 | 190.146.100.64/27 | 190.146.100.65 – 190.146.100.94 |
| G4 | 190.146.100.96/27 | 190.146.100.97 – 190.146.100.126 |

---

### 1.2 Qué hace un router

Un router tiene varias interfaces. Cada interfaz está conectada a una red distinta.

Ejemplo:

```text
Router R1
E0 → red 190.146.100.0/27
E1 → red 190.146.100.32/27
```

Eso significa que R1 puede comunicar directamente esas dos redes.

Pero si R1 quiere enviar tráfico a una red que no tiene conectada directamente, necesita una **ruta**.

---

### 1.3 Gateway o puerta de enlace

El **gateway** de un PC es la IP del router dentro de su propia subred.

Ejemplo:

```text
PC G1:       190.146.100.10/27
Gateway:     190.146.100.1
Router E0:   190.146.100.1/27
```

Cuando el PC quiere ir a otra subred, no busca directamente al PC destino. Envía el paquete al router.

---

## 2. La tabla de rutas

La tabla de rutas es la lista que usa el router para decidir por dónde mandar los paquetes.

Se ve con:

```cisco
show ip route
```

Una ruta suele tener esta lógica:

```text
Para llegar a la red X, envía el paquete por este siguiente salto o por esta interfaz.
```

Ejemplo:

```cisco
ip route 190.146.100.64 255.255.255.224 190.146.100.34
```

Significa:

```text
Para llegar a 190.146.100.64/27, manda el tráfico al router vecino 190.146.100.34.
```

---

## 3. Tipos de rutas

### 3.1 Rutas directamente conectadas

Son las redes que el router conoce porque tiene una interfaz dentro de ellas.

Ejemplo:

```text
R1 E0 = 190.146.100.1/27
```

Entonces R1 conoce directamente:

```text
190.146.100.0/27
```

En `show ip route` suelen aparecer con la letra:

```text
C
```

de **Connected**.

---

### 3.2 Rutas estáticas

Son rutas configuradas manualmente por el administrador.

Ejemplo:

```cisco
ip route 190.146.100.64 255.255.255.224 190.146.100.34
```

Ventajas:

- mucho control;
- no genera tráfico de actualización entre routers;
- fácil de entender en redes pequeñas;
- más predecible.

Inconvenientes:

- si cambia la red, hay que modificar rutas a mano;
- si cae un enlace, el router no siempre sabe buscar alternativa;
- no escala bien en redes grandes.

En `show ip route` aparecen como:

```text
S
```

de **Static**.

---

### 3.3 Ruta por defecto

Es la ruta que se usa cuando no hay una ruta más específica.

Ejemplo:

```cisco
ip route 0.0.0.0 0.0.0.0 190.146.100.34
```

Significa:

```text
Todo lo que no sepa dónde va, mándalo a 190.146.100.34.
```

En un PC sería equivalente a decir:

```text
mi salida hacia fuera es mi gateway
```

En un router, una ruta por defecto suele aparecer como:

```text
S*
```

---

### 3.4 Rutas dinámicas

Son rutas aprendidas automáticamente mediante un protocolo de enrutamiento.

Ejemplos:

- RIP;
- OSPF;
- EIGRP;
- BGP.

Los routers intercambian información y aprenden caminos hacia redes que no tienen conectadas directamente.

Ventajas:

- se adapta mejor a cambios;
- si cae un enlace, puede buscar otro camino;
- escala mejor en redes medianas o grandes.

Inconvenientes:

- consume más recursos;
- es más complejo;
- se pierde algo de control manual;
- puede tardar un tiempo en reconverger tras un fallo.

---

## 4. Cómo decide un router qué ruta usar

El router no elige al azar. Mira la tabla de rutas y aplica reglas.

### 4.1 Primero: ruta más específica

Si tiene estas dos rutas:

```text
190.146.100.0/24
190.146.100.64/27
```

y el destino es:

```text
190.146.100.70
```

elige:

```text
190.146.100.64/27
```

porque es más específica.

Esto se llama **longest prefix match**.

---

### 4.2 Después: distancia administrativa

Si el router aprende la misma red por varios métodos, compara la confianza de cada fuente.

De forma simplificada:

| Tipo de ruta | Confianza aproximada |
|---|---|
| Directamente conectada | Muy alta |
| Estática | Alta |
| Dinámica | Depende del protocolo |

La idea importante: una ruta estática suele tener prioridad sobre una ruta aprendida dinámicamente, salvo que se configure otra cosa.

---

### 4.3 Después: métrica

Dentro de un protocolo dinámico, la **métrica** sirve para elegir el mejor camino.

Cada protocolo usa su propio criterio.

| Protocolo | Criterio simplificado |
|---|---|
| RIP | Número de saltos |
| OSPF | Coste del enlace |
| EIGRP | Métrica compuesta |
| BGP | Políticas entre sistemas autónomos |

---

## 5. RIP

### 5.1 Qué es RIP

**RIP** es un protocolo de enrutamiento dinámico sencillo.

Su criterio principal es el número de saltos:

```text
menos routers intermedios = mejor ruta
```

Limitación importante:

```text
máximo 15 saltos
```

Por eso RIP sirve para prácticas y redes pequeñas, pero no es el protocolo ideal para redes grandes.

---

### 5.2 RIP versión 1 y versión 2

RIP v1 es más antiguo y no maneja bien redes con máscaras variables.

RIP v2 es más adecuado porque sí transporta información de máscara.

En prácticas modernas se usa normalmente:

```cisco
router rip
 version 2
```

---

### 5.3 Configuración básica de RIP

Ejemplo:

```cisco
configure terminal
router rip
 version 2
 network 190.146.100.0
end
```

Idea importante:

El comando `network` no significa exactamente “publica solo esta subred concreta” como si fuera una ruta estática. En RIP indica en qué redes/interfaces participa el protocolo.

En una práctica sencilla con todo dentro de `190.146.100.0`, puede bastar con:

```cisco
network 190.146.100.0
```

---

### 5.4 Qué ocurre si cae un enlace

Con rutas estáticas, si no hay ruta alternativa configurada, la comunicación puede fallar hasta que alguien intervenga.

Con RIP, los routers intercambian actualizaciones y pueden aprender otro camino. Esto se llama **reconvergencia**.

La pega es que no es instantáneo. Puede tardar unos segundos.

---

## 6. Otros protocolos dinámicos que conviene conocer

### 6.1 OSPF

OSPF es un protocolo dinámico más avanzado que RIP.

Características:

- se usa mucho en redes internas;
- calcula rutas según coste;
- converge más rápido que RIP;
- escala mejor;
- permite dividir la red en áreas.

Para entender el tema, basta con recordar:

```text
OSPF es más profesional y escalable que RIP.
```

---

### 6.2 EIGRP

EIGRP es un protocolo desarrollado por Cisco.

Características:

- converge rápido;
- usa una métrica más compleja;
- históricamente muy asociado a equipos Cisco.

---

### 6.3 BGP

BGP se usa para enrutar entre grandes redes, operadores e Internet.

No es el típico protocolo de una LAN pequeña.

Idea clave:

```text
RIP/OSPF/EIGRP → routing interno
BGP → routing entre grandes organizaciones o sistemas autónomos
```

---

## 7. Enrutamiento estático frente a dinámico

| Aspecto | Estático | Dinámico |
|---|---|---|
| Configuración | Manual | Automática mediante protocolo |
| Control | Muy alto | Menor |
| Fallos | Requiere intervención o rutas alternativas | Puede reconverger solo |
| Escalabilidad | Mala en redes grandes | Mejor |
| Recursos | Bajo consumo | Más consumo |
| Uso típico | Redes pequeñas, rutas fijas, salida por defecto | Redes medianas/grandes o cambiantes |

Conclusión:

```text
No hay un método universal. Depende del tamaño, estabilidad y necesidad de control.
```

---

## 8. Aclaración importante: “por origen” y “por destino”

En routing normal, los routers enrutan principalmente por **destino**.

Es decir, el router mira la IP destino y decide por dónde enviar el paquete.

Ejemplo:

```cisco
ip route 190.146.100.64 255.255.255.224 190.146.100.34
```

Esto es enrutamiento por destino.

---

### 8.1 ¿Qué sería realmente enrutar por origen?

Enrutar por origen significa tomar decisiones según quién envía el tráfico.

Ejemplo:

```text
Si el origen es la red A, mándalo por el enlace 1.
Si el origen es la red B, mándalo por el enlace 2.
```

Eso no es una ruta estática normal. Eso suele hacerse con **PBR**, es decir, **Policy-Based Routing**.

Ejemplo conceptual:

```cisco
access-list 10 permit 192.168.1.0 0.0.0.255

route-map PBR permit 10
 match ip address 10
 set ip next-hop 10.0.0.2

interface GigabitEthernet0/0
 ip policy route-map PBR
```

Para estudiar el tema, quédate con esto:

```text
Routing normal = decide por destino.
Routing por origen = caso especial, normalmente con políticas.
```

---

## 9. ARP y routing

ARP sirve para traducir:

```text
IP → MAC
```

Pero solo dentro de la red local.

Si un PC quiere hablar con otro PC de su misma subred, busca la MAC de ese PC.

Si quiere hablar con un PC de otra subred, busca la MAC de su gateway.

Ejemplo:

```text
PC1 quiere llegar a PC2 en otra red.
PC1 no pregunta “¿cuál es la MAC de PC2?”.
PC1 pregunta “¿cuál es la MAC de mi router?”.
```

Luego el router se encarga de reenviar el paquete.

Comando útil en PC:

```bash
arp -a
```

---

## 10. Cómo encaja la práctica de Packet Tracer

Ahora sí tiene sentido la práctica.

Lo que haces en Packet Tracer es comprobar estas ideas:

1. Divides una red grande en subredes.
2. Configuras IPs en PCs y routers.
3. Compruebas que cada router conoce sus redes directamente conectadas.
4. Activas RIP para que aprendan redes remotas.
5. Verificas con `show ip route`.
6. Haces ping entre subredes.
7. Usas `traceroute` para ver el camino.
8. Desconectas enlaces para ver si RIP reconverge.
9. Compruebas ARP para ver que el PC habla con el gateway, no directamente con el host remoto.

---

## 11. Comandos esenciales

### 11.1 Configurar una interfaz

```cisco
configure terminal
interface ethernet 0
 ip address 190.146.100.1 255.255.255.224
 no shutdown
end
```

---

### 11.2 Ver tabla de rutas

```cisco
show ip route
```

Letras importantes:

```text
C  = red directamente conectada
S  = ruta estática
S* = ruta estática por defecto
R  = ruta aprendida por RIP
```

---

### 11.3 Configurar ruta estática

```cisco
ip route RED_DESTINO MASCARA SIGUIENTE_SALTO
```

Ejemplo:

```cisco
ip route 190.146.100.64 255.255.255.224 190.146.100.34
```

---

### 11.4 Configurar ruta por defecto

```cisco
ip route 0.0.0.0 0.0.0.0 190.146.100.34
```

---

### 11.5 Configurar RIP

```cisco
configure terminal
router rip
 version 2
 network 190.146.100.0
end
```

---

### 11.6 Verificar conectividad

```bash
ping IP_DESTINO
traceroute IP_DESTINO
```

En Cisco también puede aparecer como:

```cisco
traceroute IP_DESTINO
```

---

## 12. Caso del ISP

En el caso del ISP, la pregunta no tiene una única respuesta cerrada. Hay que razonar.

### Opción 1: estático

Puede tener sentido si:

- el ISP controla todos los routers;
- conoce toda la topología;
- quiere controlar exactamente por dónde va el tráfico;
- la red no cambia demasiado.

Problema:

```text
si hay una avería, alguien debe corregir o prever rutas alternativas.
```

---

### Opción 2: dinámico

Puede tener sentido si:

- hay muchos routers;
- la red cambia;
- se necesita tolerancia a fallos;
- no se quiere depender de cambios manuales.

Problema:

```text
el administrador pierde parte del control exacto del camino elegido.
```

---

### Opción 3: solución mixta

Suele ser la respuesta más razonable.

Idea:

- usar rutas estáticas donde se quiera control;
- usar rutas dinámicas donde se quiera adaptación;
- definir prioridades;
- tener rutas alternativas preparadas.

Conclusión:

```text
Si conozco toda la red y tengo acceso a todos los routers, el estático es posible.
Si quiero tolerancia a fallos y escalabilidad, el dinámico es mejor.
En un ISP realista, una solución mixta suele ser la más equilibrada.
```

---

## 13. Qué debería saber explicar en un examen

Preguntas típicas:

### ¿Qué es routing?

Es el proceso por el que un router decide cómo enviar paquetes entre redes distintas.

### ¿Qué diferencia hay entre routing estático y dinámico?

El estático se configura manualmente. El dinámico se aprende mediante protocolos como RIP u OSPF.

### ¿Qué hace RIP?

Permite que los routers aprendan rutas automáticamente usando como métrica el número de saltos.

### ¿Qué es una ruta por defecto?

Una ruta que se usa cuando no existe una ruta más específica hacia el destino.

### ¿Qué hace ARP?

Traduce una IP local a una MAC. Si el destino está fuera de la red, el PC resuelve la MAC del gateway.

### ¿Por qué traceroute es útil?

Porque muestra el camino real de los paquetes, no solo si llegan o no.

### ¿Cuándo elegirías estático?

En redes pequeñas, estables o cuando se quiere control total.

### ¿Cuándo elegirías dinámico?

En redes más grandes, cambiantes o donde se necesita tolerancia a fallos.

---

## 14. Resumen final del tema

El routing consiste en conectar redes distintas.

Un router decide usando su tabla de rutas. Las rutas pueden ser:

- directamente conectadas;
- estáticas;
- por defecto;
- dinámicas.

RIP es un protocolo dinámico sencillo que aprende rutas mediante número de saltos.

El routing estático da control, pero exige mantenimiento manual.

El routing dinámico se adapta mejor a fallos, pero es más complejo.

En la práctica de Packet Tracer se aplican estos conceptos configurando routers, subredes, RIP, rutas, ping, traceroute y ARP.

La idea importante no es memorizar comandos sueltos, sino entender esta cadena:

```text
IP + máscara → subred
subred distinta → gateway
gateway → router
router → tabla de rutas
tabla de rutas → siguiente salto
siguiente salto → conectividad
```
