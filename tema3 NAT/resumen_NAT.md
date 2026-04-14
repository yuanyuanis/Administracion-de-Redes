# Unidad 3: NAT — Resumen de Estudio en Profundidad

## 1. ¿Qué problema resuelve NAT y por qué existe?

Internet funciona con direcciones IP públicas: cada paquete necesita una dirección de origen y destino **únicas a nivel mundial** para que los routers intermedios sepan dónde enviarlo. Sin embargo, el espacio de direcciones IPv4 (unos 4.300 millones) se agotó hace años. 

**NAT (Network Address Translation)** nació como parche a este problema. La idea es sencilla pero poderosa: dentro de una red privada usamos direcciones que **no son válidas en Internet** (rangos privados como 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), y cuando un paquete necesita salir a Internet, **el router traduce** esa IP privada a una IP pública que sí es enrutable.

> **Clave conceptual:** NAT no "crea" conectividad nueva. Lo que hace es **engañar** a Internet: el servidor externo cree que habla con la IP pública del router, pero en realidad el router está reenviando los paquetes al equipo privado correspondiente.

---

## 2. La topología de la práctica

```
  Red Interna (privada)              Router               Red Externa (pública)
  190.146.100.0/24                                        190.146.15.0/24
                                   ┌─────────┐
  PC Interno 1 ──────────────────►│  Eth0    │
  (190.146.100.2)                  │ (inside) │
                                   │          │────────►  Servidor Internet
  PC Interno 2 ──────────────────►│  Eth1    │           (190.146.15.2)
  (190.146.100.3)                  │(outside) │
                                   └─────────┘
```

**¿Por qué se marcan las interfaces como "inside" y "outside"?**  
Porque el router necesita saber **en qué dirección aplicar la traducción**. Cuando un paquete entra por la interfaz `inside`, el router sabe que debe traducir la IP de origen (privada → pública). Cuando la respuesta vuelve por la interfaz `outside`, traduce la IP de destino (pública → privada). Sin esta marca, el router no sabría cuándo ni cómo traducir.

---

## 3. NAT Estático

### ¿Qué es?
Una asociación **fija y permanente** entre una IP privada y una IP pública. Se configura manualmente: "la IP privada X siempre sale con la IP pública Y".

### ¿Cómo funciona paso a paso?

1. El PC interno (190.146.100.2) envía un paquete con destino al servidor (190.146.15.2).
2. El paquete llega al router por la interfaz `inside` (Eth0).
3. El router consulta su **tabla NAT estática** y encuentra: `190.146.100.2 ↔ 190.146.15.3`.
4. **Reescribe la IP de origen** del paquete: cambia 190.146.100.2 por 190.146.15.3.
5. Envía el paquete por la interfaz `outside` (Eth1).
6. El servidor responde a 190.146.15.3 (no sabe que existe 190.146.100.2).
7. La respuesta llega al router por `outside`. El router consulta la tabla y **reescribe la IP de destino**: cambia 190.146.15.3 por 190.146.100.2.
8. Entrega el paquete al PC interno.

### Configuración clave en Cisco

```
Router(config)# interface ethernet 0
Router(config-if)# ip nat inside          ← marca la interfaz como zona interna
Router(config-if)# exit

Router(config)# interface ethernet 1
Router(config-if)# ip nat outside         ← marca la interfaz como zona externa
Router(config-if)# exit

Router(config)# ip nat inside source static 190.146.100.2 190.146.15.3
```

> **¿Por qué "inside source"?** Porque estamos traduciendo la **dirección de origen** de los paquetes que vienen desde el **interior**. El router entiende que el "source" del tráfico inside debe ser reemplazado.

### Verificación

- `show ip nat translations` → muestra la tabla de traducciones activas.
- `show ip nat statistics` → muestra contadores: traducciones activas, hits, misses.

### ¿Cuándo tiene sentido usar NAT estático?

- Cuando un equipo interno **necesita ser accesible desde fuera siempre con la misma IP** (ej: un servidor web interno).
- La asociación es permanente → no hay riesgo de perder conectividad por timeout.

### Limitación fundamental

Si tienes 5 IPs públicas, **solo 5 equipos pueden tener acceso a Internet**. Relación 1:1 estricta. En una empresa con 200 empleados, necesitarías 200 IPs públicas → inviable económicamente.

---

## 4. NAT Dinámico

### ¿Qué cambia respecto al estático?

La diferencia clave es **quién decide la asociación**. En estático, tú dices "esta IP va con esta otra". En dinámico, **el router asigna automáticamente** una IP pública libre del pool cuando un equipo interno necesita salir.

### ¿Por qué es mejor que el estático en muchos casos?

Imagina una oficina con 50 empleados pero solo 10 IPs públicas. No todos están navegando al mismo tiempo. NAT dinámico permite que, cuando el empleado A deja de usar Internet, su IP pública se libera y el empleado B puede usarla. **Se aprovechan las IPs por turnos.**

### Funcionamiento paso a paso

1. Se define un **pool** (grupo) de IPs públicas disponibles: ej. 190.146.15.20 a 190.146.15.21 (2 IPs).
2. Se define una **ACL** (Access Control List) que identifica qué IPs privadas tienen permiso de ser traducidas.
3. Se vincula la ACL con el pool.
4. Cuando PC1 quiere salir → el router le asigna 190.146.15.20.
5. Cuando PC2 quiere salir → el router le asigna 190.146.15.21.
6. Si PC3 intenta salir → **no hay IPs disponibles** → se deniega hasta que una se libere.

### Configuración clave

```
Router(config)# access-list 115 permit ip 190.146.100.0 0.0.0.255 any
```

> **¿Qué es `0.0.0.255`?** Es la **wildcard mask** (máscara inversa). Donde hay un 0 → ese octeto debe coincidir exactamente. Donde hay 255 → cualquier valor es válido. Así, `190.146.100.0 0.0.0.255` = "cualquier IP que empiece por 190.146.100".

```
Router(config)# ip nat pool OrgiaDeDireccionesSalida 190.146.15.20 190.146.15.21 netmask 255.255.255.0
Router(config)# ip nat inside source list 115 pool OrgiaDeDireccionesSalida
Router(config)# ip nat translation timeout 10
```

### El concepto de timeout: ¿por qué importa?

El timeout (10 segundos en el ejemplo) define **cuánto tiempo se mantiene una asociación inactiva**. Cuando un equipo deja de enviar tráfico, tras 10 segundos la IP pública queda libre.

**Trade-off importante:**
- Timeout **bajo** → las IPs se liberan rápido → más usuarios pueden rotar → pero si un usuario tiene una pausa breve, pierde su IP y la conexión puede cortarse.
- Timeout **alto** → conexiones más estables → pero las IPs quedan bloqueadas más tiempo → menos rotación.

### Limitación fundamental

Sigue habiendo un **límite duro**: si tienes 2 IPs públicas, máximo 2 equipos conectados **simultáneamente**. Mejor que estático (por la rotación), pero aún insuficiente para redes grandes.

### Comando útil

```
Router# clear ip nat translation forced    ← borra todas las entradas de la tabla NAT
Router# show ip nat translation            ← verifica que la tabla está vacía
```

---

## 5. PAT (Port Address Translation) — El NAT más usado

TCP de forma segura
UDP de forma de streamig

### ¿Por qué PAT es revolucionario?

NAT estático y dinámico trabajan solo en **capa 3** (capa de red): traducen IPs. 
PAT añade la **capa 4** (capa de transporte): traduce también **puertos**. Esto cambia todo.

### La idea clave

Con una **única IP pública**, PAT puede gestionar hasta **65.536 conexiones simultáneas** (una por puerto). 

¿Cómo? Cada conexión interna se identifica no solo por su IP, sino por la **combinación IP:puerto**.

### Ejemplo paso a paso

```
ANTES de PAT (en la red interna):
  PC1 (190.146.100.3:54644) ──► Servidor (190.146.15.2:80)
  PC2 (190.146.100.2:52707) ──► Servidor (190.146.15.2:80)

DESPUÉS de PAT (lo que ve el servidor):
  Router (190.146.15.50:54644) ──► Servidor (190.146.15.2:80)
  Router (190.146.15.50:52707) ──► Servidor (190.146.15.2:80)
```

**Ambos PCs comparten la misma IP pública** (190.146.15.50), pero el router los distingue por el **puerto de origen**. Cuando el servidor responde al puerto 54644, el router sabe que es para PC1. Cuando responde al 52707, sabe que es para PC2.

### ¿Por qué funciona esto?

Porque en TCP/UDP, una conexión se identifica por una **tupla de 4 elementos**: IP origen, puerto origen, IP destino, puerto destino. Aunque la IP origen sea la misma para todos los PCs internos, el puerto origen es diferente para cada conexión → cada conexión es distinguible.

### Configuración

```
Router(config)# access-list 120 permit ip 190.146.100.0 0.0.0.255 any
Router(config)# ip nat pool MiDireccion 190.146.15.50 190.146.15.50 netmask 255.255.255.0
Router(config)# ip nat inside source list 120 pool MiDireccion overload
```

> **La palabra mágica es `overload`**. Es lo que convierte un NAT dinámico normal en PAT. Le dice al router: "sobrecarga esta IP, usa puertos para distinguir conexiones".

### La tabla de traducciones PAT

```
Pro  Inside global          Inside local          Outside local      Outside global
tcp  190.146.15.50:54644    190.146.100.3:54644   190.146.15.2:80    190.146.15.2:80
tcp  190.146.15.50:52707    190.146.100.2:52707   190.146.15.2:80    190.146.15.2:80
icmp 190.146.15.50:3434     190.146.100.2:3434    190.146.15.2:3434  190.146.15.2:3434
```

Observa cómo cada fila incluye el **protocolo y el puerto**, no solo la IP. Esto es lo que permite la multiplexación.

---

## 6. Comparativa final: ¿Cuál elegir y por qué?

| Criterio | NAT Estático | NAT Dinámico | PAT |
|---|---|---|---|
| **Asociación IP** | Manual, fija 1:1 | Automática, temporal 1:1 | Automática, N:1 (muchos a uno) |
| **Capa OSI** | Capa 3 | Capa 3 | Capa 3 + Capa 4 |
| **Usuarios simultáneos** | = nº IPs públicas | = nº IPs públicas | Hasta 65.536 por IP pública |
| **Conectividad permanente** | Sí | No (timeout) | Sí (mientras haya puertos libres) |
| **Caso de uso ideal** | Servidores internos accesibles desde fuera | Redes medianas con IPs de sobra | Cualquier red moderna (el más común) |
| **Escalabilidad** | Muy baja | Baja-media | Muy alta |
| **Seguridad** | Requiere ACL por IP | Requiere ACL por IP | Una sola interfaz que controlar |

### ¿Por qué PAT es el estándar de facto?

1. **Economía**: una sola IP pública sirve para toda la organización.
2. **Seguridad**: al concentrar todo el tráfico saliente en una interfaz, las ACLs y reglas de firewall se simplifican enormemente.
3. **Escalabilidad**: 65.536 puertos × múltiples IPs públicas = capacidad prácticamente ilimitada.
4. **Versatilidad**: permite redirigir puertos entrantes a servidores internos específicos (port forwarding).

---

## 7. Conceptos clave que debes dominar

- **Inside local**: la IP real del equipo en la red interna (ej: 190.146.100.2).
- **Inside global**: la IP con la que ese equipo aparece en Internet (ej: 190.146.15.3 o 190.146.15.50:54644).
- **Outside local / Outside global**: en configuraciones simples, suelen ser la misma IP (la del servidor externo).
- **Wildcard mask**: la inversa de la máscara de subred. Se usa en ACLs. `255.255.255.0` → wildcard `0.0.0.255`.
- **Pool de NAT**: conjunto de IPs públicas disponibles para traducción.
- **Overload**: keyword que activa PAT sobre un pool o interfaz.
- **ACL + NAT**: la ACL define **quién** puede ser traducido; el pool/interfaz define **cómo** se traduce.
