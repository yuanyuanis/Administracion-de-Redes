# ACLs — Notas de estudio

---

## El problema que resuelven las ACLs

El router por defecto solo hace una cosa, mirar la IP destino y reenviar. Le da igual quién mandó el paquete, qué protocolo es o qué puerto usa. Si hay ruta, pasa.

Eso está bien hasta el día en que quieres decir "este tráfico sí, este no".

Ahí aparece la ACL:

- un filtro en la puerta que el router consulta antes (o después) de enrutar.
- Es lo más parecido a un firewall que trae Cisco de serie, y durante años fue el mecanismo de seguridad perimetral, antes de que los firewalls dedicados se volvieran baratos.

Hoy se siguen usando todo el rato, y no solo para seguridad. Se usan para:

### Filtrar tráfico entre VLANs

> ¿Cómo es esto este trabajo no lo hace ya una VLAN?

Pero el router (o switch L3) es quien las comunica.

**Aquí el detalle clave:**

- **El Switch (Capa 2):** Su trabajo es el aislamiento. Las VLANs crean "muros" lógicos. Los dispositivos en la VLAN de Invitados están en una "isla" y los de Contabilidad en otra. No pueden hablarse entre sí de ninguna manera.
- **El Router / Switch L3 (Capa 3):** Para que las VLANs tengan salida a Internet o puedan compartir impresoras/servidores, necesitan un dispositivo que las interconecte (Inter-VLAN Routing).

Ahí es donde entra el peligro: En cuanto activas el routing para que tengan internet, el router, por defecto, intentará conectar todas las redes que conoce.

**La diferencia real:**

- **Sin ACL:** El router actúa como una puerta abierta entre las dos islas. El switch las separó, pero el router las volvió a unir.
- **Con ACL:** El router actúa como un guardia de seguridad en esa puerta. Permite que ambas VLANs salgan a Internet, pero bloquea específicamente el paso de "Invitados" hacia "Contabilidad".

**En resumen:** El switch segmenta, pero la ACL es la que pone las reglas de quién tiene permiso para cruzar de un segmento a otro una vez que el router habilita el camino.

### Proteger el propio router (Control Plane)

No solo filtramos el tráfico que "pasa por" el router, sino el que va "dirigido al" router.

- **El riesgo:** Si dejas abierto el puerto de gestión (como Telnet o SSH), cualquiera en la red podría intentar hackearlo.
- **La solución:** Aplicas una ACL a las líneas VTY (las terminales virtuales) para que solo las IP de los administradores puedan conectarse.

### Clasificar tráfico para QoS (priorizar VoIP, por ejemplo)

- **El ejemplo de VoIP:** La voz sobre IP es sensible al retraso. Creas una ACL que diga: "Todo lo que use el puerto UDP 5060 (VoIP) es VIP".
- **Resultado:** El router ve esa "etiqueta" y pone esos paquetes al principio de la cola para que no se corten las llamadas aunque la red esté saturada.

### Decidir qué tráfico se traduce con NAT

Imagina que el router de tu empresa es como un recepcionista en un hotel que solo tiene un teléfono con línea exterior (tu única IP Pública). Los empleados (IPs privadas) están en sus extensiones internas.

Si un empleado quiere llamar fuera, el recepcionista tiene que hacer el cambio (NAT/PAT). Pero, como tú dices, no quieres que todos llamen fuera.

- **Sin ACL:** El router es un "bien mandado". Todo el que le pide salir, él le presta la IP pública y lo saca a Internet.
- **Con ACL (El filtro):** Tú le das una lista al recepcionista (el router) que dice: "Solo los jefes de departamento pueden llamar fuera".

**¿Cómo funciona el proceso?**

1. El paquete del "becario Juan" llega al router.
2. El router mira la ACL. La ACL dice: "Juan no tiene permiso para ser traducido (NAT)".
3. El router no le pone su IP pública al paquete de Juan. Como un paquete con IP privada no puede navegar por Internet (se perdería), el router simplemente lo descarta.

**En resumen:** Usas la ACL para decirle al router: "A este grupo de IPs sí cámbiales la dirección para que salgan a la calle (NAT), pero a este otro grupo déjalos encerrados en la oficina".

### Elegir qué redes anuncia un protocolo de routing

---

## Cómo se monta la red en una empresa real

En la vida real, para una empresa de 100 empleados, la red no es un caos de cables, sino que está muy jerarquizada. Tienes razón en sospechar del Firewall: hoy en día es el "rey" de la seguridad, pero no lo hace todo solo.

Aquí tienes cómo se monta "la verdad" en una oficina actual:

### 1. ¿Quién manda? El Firewall de Próxima Generación (NGFW)

En una empresa de 100 personas, ya no se suelen usar ACLs básicas en el router para salir a Internet. Se usa un Firewall (como un Fortinet, Cisco Firepower o Palo Alto).

- **Lo que hace el Firewall:** Hace el NAT (lo que explicamos antes), pero además "mira" dentro del paquete. No solo dice "Juan sale a Internet", sino que dice "Juan está intentando entrar en una web de apuestas; lo bloqueo aunque tenga permiso para navegar".
- **Administración:** El administrador de red entra en una interfaz web y crea reglas de este tipo: `Origen: VLAN_Invitados -> Destino: Internet -> Acción: Permitir -> Filtro: No redes sociales`.

### 2. ¿Switch o Wi-Fi? (La Capa de Acceso)

Aunque todo el mundo use Wi-Fi, los Switches siguen siendo el esqueleto.

- Los puntos de acceso Wi-Fi (AP) están colgados del techo, pero van conectados por cable a un Switch.
- En el Switch es donde se configuran las VLANs. El Switch "marca" el tráfico: "Este paquete viene del Wi-Fi de Invitados, ponle la etiqueta VLAN 10".
- **Administración:** Aquí administras los puertos. Si alguien conecta un PC a la pared, el switch debe saber a qué departamento pertenece.

### 3. ¿Dónde quedaron las ACLs que estudiamos?

Se siguen usando, pero en sitios muy específicos para que la red no vaya lenta:

- **En el Switch Core (el cerebro):** Si quieres que la VLAN de Contabilidad no hable con la de Invitados, pones una ACL directamente en el switch para que el tráfico se corte ahí mismo y no tenga que llegar hasta el Firewall. Es más rápido.
- **Seguridad de dispositivos:** Para que nadie toque el router o los switches, usas una ACL que diga: "Solo se puede configurar este equipo desde la IP del administrador".

### 4. ¿Qué se administra "a alto nivel" en el día a día?

Si tú fueras el administrador de esa red de 100 personas, tus tareas serían:

| Tarea | Dispositivo |
|---|---|
| Gestión de Identidad | Decidir quién entra a qué (usando algo llamado Active Directory o RADIUS). |
| VPN | Configurar el acceso para los que trabajan desde casa (esto lo hace el Firewall). |
| Ancho de Banda (QoS) | Asegurarte de que las videollamadas de Zoom no se corten porque alguien se ha puesto a descargar un archivo pesado. |
| Segmentación | Crear nuevas VLANs si, por ejemplo, decides poner cámaras de seguridad o impresoras nuevas. |
| Monitorización | Mirar gráficas para ver si la línea de internet está saturada o si hay un ataque. |

**En resumen:**

En la vida real, el Firewall es el que toma las decisiones complejas de seguridad y NAT, los Switches se encargan de mover los datos rápido y separar las redes (VLANs), y el Wi-Fi es solo el "cable invisible" que conecta al usuario con el Switch.

Las ACLs son las "instrucciones de emergencia" que dejas grabadas en los equipos para que sepan qué filtrar sin preguntar constantemente al firewall.

---

## 🔴 1. ¿Qué es realmente una ACL?

Una ACL (Access Control List) es simplemente:

👉 **una lista de reglas que dicen qué tráfico se permite y cuál se bloquea**

Ejemplo básico:

```
access-list 10 permit 192.168.1.0 0.0.0.255
```

Eso significa:
👉 "permito tráfico que venga de esa red"

**Pero ojo:**
- 👉 esto SOLO crea la lista
- 👉 NO hace nada todavía

Es como escribir normas en un papel… pero no poner al guardia.

---

## 🔴 2. "Aplicar en interfaz" (aquí está tu bloqueo mental)

Aquí está la clave:

👉 Un router tiene interfaces (puertos):

- hacia tu red (LAN)
- hacia internet (WAN)

**Ejemplo:**

```
Gig0/0 → red interna
Gig0/1 → internet
```

💡 **Aplicar la ACL = decirle al router dónde usar esas reglas**

Se hace así:

```
interface Gig0/0
ip access-group 10 in
```

Esto significa:
👉 "usa la ACL 10 en esta interfaz"

---

## 🔴 3. ¿Qué significa IN y OUT? (esto es lo que te lía)

👉 **SIEMPRE desde el punto de vista del router**

### 🔵 IN (entrada)

👉 El paquete entra al router por esa interfaz

📌 Se revisa ANTES de decidir a dónde va

### 🔵 OUT (salida)

👉 El paquete sale del router por esa interfaz

📌 Se revisa DESPUÉS de enrutar

---

## 🔴 4. Visualización clara (sin metáforas raras)

Imagina esto:

```
PC ----> [Router] ----> Internet
```

**Caso IN**

```
PC --> Router
      ↑ aquí se aplica la ACL (IN)
```

- 👉 El router mira el paquete antes de procesarlo
- 👉 Si no pasa → lo tira directamente

**Caso OUT**

```
Router --> Internet
          ↑ aquí se aplica la ACL (OUT)
```

- 👉 El router ya decidió el destino
- 👉 Pero antes de enviarlo, lo filtra

---

## 🔴 5. ¿Por qué importa IN vs OUT?

Porque afecta a eficiencia:

👉 **Si bloqueas en IN:**
- no pierdes tiempo enrutando basura

👉 **Si bloqueas en OUT:**
- el router ya ha trabajado → menos eficiente

---

## 🔴 6. Tipos de ACL (esto sí lo has entendido a medias)

### 🟡 ACL estándar

```
access-list 10 permit 192.168.1.0 0.0.0.255
```

👉 SOLO mira:
- IP de origen

❌ NO mira:
- destino
- puertos
- protocolo

📌 **Problema:**
👉 es muy bruta

Si bloqueas una IP → la bloqueas para TODO

👉 Por eso:
✅ **se coloca cerca del destino**

### 🔵 ACL extendida

```
access-list 120 deny tcp host 190.146.100.3 any eq 22
access-list 120 permit ip any any
```

👉 Puede filtrar por:
- origen
- destino
- protocolo (tcp, udp…)
- puerto (ej: 22 = SSH)

📌 **Es precisa:**
👉 solo bloqueas lo que quieres

👉 Por eso:
✅ **se coloca cerca del origen**

---

## 🔴 7. Resumen sin paja

- ACL = lista de reglas → sola no hace nada
- "Aplicarla" = usar `ip access-group` en una interfaz
- IN = tráfico entrando al router
- OUT = tráfico saliendo del router
- estándar = solo origen → cerca del destino
- extendida = todo → cerca del origen

---

## 🔴 1. ACL nombradas (esto es lo fácil)

**Antes:**

```
access-list 120 deny tcp host 190.146.100.3 any eq 22
```

**Ahora (mejor):**

```
ip access-list extended BLOQUEA_BECARIO
 10 deny tcp host 190.146.100.3 any eq 22
 20 permit ip any any
```

👉 **Diferencia REAL:**
- Antes usabas números (10, 120…)
- Ahora usas un nombre (BLOQUEA_BECARIO)

### 💡 ¿Por qué es mejor?

Porque puedes modificarla sin romper todo:

👉 Puedes hacer:

```
15 deny icmp host 190.146.100.3 any
```

Y se coloca entre la 10 y la 20

📌 **Sin esto:**
- tenías que borrar TODA la ACL
- volver a escribirla
- riesgo de cortar red en producción

👉 Esto en empresas = 💀

---

## 🔴 2. `permit ip` vs `permit tcp` (esto es conceptual)

Aquí está la clave:

- 👉 `ip` = TODO
- 👉 `tcp` = SOLO tráfico TCP

### 🔵 Ejemplo claro

```
permit ip any any
```

👉 Permite:
- TCP (web, ssh…)
- UDP (DNS, DHCP…)
- ICMP (ping)
- TODO

### 🔵 En cambio:

```
permit tcp any any
```

👉 SOLO permite:
- tráfico TCP

❌ Bloquea:
- UDP
- ICMP (ping)
- DHCP

### 💥 Error típico

Principiante hace esto:

```
permit tcp any any
permit udp any any
permit icmp any any
```

👉 Eso es lo mismo que:

```
permit ip any any
```

Pero peor escrito.

---

## 🔴 3. La trampa del DHCP (esto es lo importante de verdad)

Aquí es donde la gente se pega.

### 💡 ¿Qué pasa cuando un PC arranca?

Un PC SIN IP hace esto:

👉 "Oye, ¿hay alguien que me dé una IP?"

Pero como NO tiene IP:

- origen → `0.0.0.0`
- destino → `255.255.255.255` (broadcast)
- protocolo → UDP
- puertos → 67/68

### 🔥 Problema con ACL

Imagina esto:

```
10 deny ip any any
```

👉 (o cualquier deny mal puesto arriba)

Entonces pasa esto:

1. El PC manda DHCP
2. Llega al router
3. La ACL dice → ❌ DENY
4. El paquete muere

👉 **Resultado:**
- el PC no obtiene IP
- la red "no funciona"
- tú te vuelves loco buscando el problema

### 💡 ¿Por qué es difícil de ver?

Porque:
- no hay error visible
- no hay IP → no hay ping → no hay nada

👉 parece que "todo está roto"

---

## 🔴 4. Cómo evitar cargarte DHCP

👉 Siempre asegúrate de permitir esto si usas ACL:

```
permit udp any eq 68 any eq 67
permit udp any eq 67 any eq 68
```

(o más simple: no bloquearlo sin querer)

---

## 🔴 5. Idea mental final (quédate con esto)

- `ip` = todo el tráfico
- `tcp` / `udp` / `icmp` = tráfico específico
- DHCP = tráfico raro (`0.0.0.0` → `255.255.255.255`)
- ACL mal puesta = puedes dejar una red entera sin IP

### 🧠 Traducción a lenguaje real

- 👉 ACL = guardia de seguridad
- 👉 DHCP = un tío sin DNI pidiendo uno

Si el guardia dice:

> "no dejo pasar a nadie sin identificación"

- 👉 ese tío nunca entra
- 👉 nunca consigue DNI
- 👉 nunca podrá entrar

💥 bucle roto

---

## Desmontando una línea como si fuera Lego

Vamos a desmontar ESTA línea:

```
10 deny tcp host 190.146.100.3 any eq 22
```

### 🔴 1. ¿Qué es el `10`?

👉 Es el número de línea (orden)

Piensa:

```
10 ...
20 ...
30 ...
```

👉 El router lee de arriba a abajo

**💡 ¿Para qué sirve?**
- Ordenar reglas
- Insertar cosas entre medias

Ejemplo:

```
10 deny ...
20 permit ...
```

Luego puedes meter:

```
15 deny ...
```

👉 Va entre 10 y 20

### 🔴 2. `deny`

👉 significa:
❌ bloquear

### 🔴 3. `tcp`

👉 tipo de tráfico

Puede ser:
- `tcp` → web, ssh…
- `udp` → DNS, DHCP…
- `icmp` → ping
- `ip` → TODO (esto es clave)

### 🔴 4. `host 190.146.100.3`

👉 origen

Significa:
👉 "solo este equipo"

### 🔴 5. `any` (el primero)

👉 destino

👉 "a cualquier sitio"

### 🔴 6. `eq 22`

👉 puerto

👉 "puerto 22"

💡 **Puerto 22 = SSH**

### 🔥 TRADUCCIÓN COMPLETA DE LA LÍNEA

```
10 deny tcp host 190.146.100.3 any eq 22
```

👉 **"Bloquea tráfico TCP desde 190.146.100.3 hacia cualquier destino en el puerto 22 (SSH)"**

---

### 🔴 7. Ahora la otra línea

```
20 permit ip any any
```

Vamos igual:

- 🔹 `20` → número de línea
- 🔹 `permit` → permitir
- 🔹 `ip` → TODO el tráfico (no solo TCP, TODO)
- 🔹 `any` (primero) → origen = cualquiera
- 🔹 `any` (segundo) → destino = cualquiera

### 🔥 TRADUCCIÓN

👉 **"Permite todo el tráfico de cualquier sitio a cualquier sitio"**

---

## 🔴 8. ¿Por qué están juntas esas dos reglas?

Porque funcionan en orden:

```
10 deny tcp host 190.146.100.3 any eq 22
20 permit ip any any
```

👉 El router hace:

1. ¿Es SSH desde esa IP?
   👉 sí → ❌ lo bloquea
2. ¿No es eso?
   👉 pasa a la siguiente → ✅ permite todo

---

## 🔴 9. CLAVE QUE TE FALTABA (muy importante)

👉 Las ACL tienen un:
❌ **"deny all" implícito al final**

**SIEMPRE**

Entonces esto:

```
10 deny tcp host 190.146.100.3 any eq 22
```

👉 en realidad es:

```
10 deny ...
(implicit) deny everything else
```

💥 **Resultado:**
👉 bloqueas TODO, no solo SSH

👉 Por eso se añade:

```
20 permit ip any any
```

---

## 🧠 RESUMEN CLARO

- `10`, `20` → orden de reglas
- `deny` / `permit` → bloquear o permitir
- `tcp` / `udp` / `ip` → tipo de tráfico
- `host IP` → quién envía
- `any` → cualquiera
- `eq 22` → puerto 22 (SSH)
- `permit ip any any` → deja pasar TODO lo demás
