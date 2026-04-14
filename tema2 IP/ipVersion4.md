# Resumen de Estudio — UD2: Routing y Direccionamiento IP

## 1. ¿Qué es una dirección IP?

Una dirección IP (Internet Protocol) es un identificador único de 32 bits (en IPv4) que se asigna a cada dispositivo conectado a una red. Se representa como cuatro números decimales separados por puntos, donde cada número va de 0 a 255. Por ejemplo: `192.168.1.1`.

Toda dirección IP tiene dos partes:

- **NET ID (identificador de red):** indica a qué red pertenece el dispositivo.
- **HOST ID (identificador de host):** identifica al dispositivo concreto dentro de esa red.

La cantidad de bits que ocupa cada parte depende de la clase de red o de la máscara de subred aplicada.

---

## 2. IP Pública vs IP Privada

**IP Privada:** es la que tiene cada dispositivo dentro de tu red local (tu portátil, móvil, tele, etc.). El router de casa se la asigna a cada uno. Estas direcciones solo tienen sentido dentro de tu red; fuera de ella no sirven. Los rangos reservados para IPs privadas son:

- Clase A: `10.0.0.0` a `10.255.255.255`
- Clase B: `172.16.0.0` a `172.31.255.255`
- Clase C: `192.168.0.0` a `192.168.255.255`

**IP Pública:** es la dirección que tu ISP (proveedor de Internet) asigna a tu router para que sea visible en Internet. Es la "cara" de toda tu red doméstica hacia el exterior. Todos los dispositivos de tu casa salen a Internet con esa misma IP pública.

> **Clave:** Distintas casas o empresas pueden usar internamente el mismo rango privado (por ejemplo, ambas pueden tener dispositivos en `192.168.1.x`) sin conflicto, porque esas direcciones nunca salen directamente a Internet.

---

## 3. NAT — Network Address Translation

### ¿Qué es?

NAT es el mecanismo que permite que varios dispositivos con IPs privadas (tu tele, portátil, móvil…) salgan todos a Internet a través de una única IP pública, la de tu router.

### ¿Cómo funciona?

Cuando tu portátil quiere acceder a una web, envía el paquete al router. El router sustituye la IP privada de origen (por ejemplo `192.168.1.5`) por su IP pública (por ejemplo `83.45.12.100`) y anota en una tabla interna qué dispositivo hizo esa petición. Cuando llega la respuesta desde Internet, el router consulta su tabla, ve que esa respuesta corresponde al portátil y le reenvía el paquete.

Así, desde fuera, todo el tráfico de tu casa parece venir de una sola IP pública, aunque internamente haya 10 o 20 dispositivos.

### ¿Por qué existe NAT?

Porque las direcciones IPv4 son limitadas (unos 4.300 millones) y no hay suficientes para asignar una IP pública a cada dispositivo del mundo. NAT permite que millones de dispositivos compartan un número mucho menor de IPs públicas.

---

## 4. CG-NAT — Carrier-Grade NAT

### ¿Qué es?

CG-NAT (NAT a gran escala del operador) es cuando tu propio ISP te asigna una IP privada en lugar de una IP pública. Es decir, hay un doble NAT:

1. **Primer NAT (tu router):** traduce las IPs privadas de tus dispositivos a la IP que te dio el ISP.
2. **Segundo NAT (el ISP):** traduce esa IP (que en realidad es privada dentro de su red) a una IP pública compartida con otros clientes.

### ¿Por qué lo hacen los ISPs?

Porque ya no quedan suficientes direcciones IPv4 públicas. Así, un ISP puede dar servicio a cientos de clientes con unas pocas IPs públicas compartidas.

### Inconvenientes del CG-NAT

- No puedes abrir puertos fácilmente (para servidores, juegos online, cámaras IP…).
- Varios clientes comparten la misma IP pública, lo que puede causar problemas con servicios que limitan conexiones por IP.
- Pierdes la posibilidad de ser localizable directamente desde Internet.

> **¿Cómo saber si estás en CG-NAT?** Compara la IP WAN de tu router con la que aparece en páginas como "cuál es mi IP". Si son diferentes, estás detrás de CG-NAT.

---

## 5. DHCP — Dynamic Host Configuration Protocol

### ¿Qué es?

DHCP es un protocolo que asigna direcciones IP de forma automática a los dispositivos que se conectan a una red. Cuando enciendes tu portátil y te conectas al WiFi, no tienes que configurar manualmente la IP: el servidor DHCP (normalmente tu router) le asigna una automáticamente.

### ¿Qué asigna exactamente?

- Una dirección IP privada disponible del rango configurado.
- La máscara de subred.
- La puerta de enlace (gateway), que es la IP del router.
- Los servidores DNS.

### IP Dinámica vs IP Estática

- **IP Dinámica:** asignada automáticamente por DHCP. Puede cambiar cada vez que te conectas o tras un tiempo determinado (lease time). Es lo habitual para dispositivos de usuario.
- **IP Estática (fija):** configurada manualmente por el administrador. No cambia. Se usa para servidores (web, correo, DNS, FTP…) que necesitan ser siempre localizables en la misma dirección.

---

## 6. IPv4 vs IPv6

### IPv4

- Direcciones de **32 bits** → aproximadamente **4.300 millones** de direcciones posibles.
- Formato: `192.168.1.1`
- Se están agotando, y por eso existen NAT y CG-NAT como parches.

### IPv6

- Direcciones de **128 bits** → un número prácticamente **infinito** de direcciones (3,4 × 10³⁸).
- Formato: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- **Cada dispositivo puede tener su propia IP pública única en el mundo**, sin necesidad de NAT.
- Fue creado precisamente para resolver el agotamiento de IPv4.
- La adopción es progresiva; hoy conviven IPv4 e IPv6.

> **Idea clave:** Con IPv6, la necesidad de NAT desaparece teóricamente, porque hay direcciones suficientes para que cada dispositivo del planeta tenga su propia IP pública.

---

## 7. Clases de Redes (IPv4)

Las clases de red determinan cuántos bits se destinan a identificar la red y cuántos al host. Esto define el tamaño de la red.

### Clase A

- **Primer byte:** identifica la red (rango del 1 al 126).
- **Tres bytes restantes:** identifican los hosts.
- **Máscara por defecto:** `255.0.0.0`
- **Hosts por red:** 2²⁴ − 2 = **16.777.214**
- Pensada para organizaciones enormes (pocas redes, muchísimos hosts).
- Ejemplo: `10.0.0.0` es una red de clase A privada.

### Clase B

- **Dos primeros bytes:** identifican la red (rango del 128 al 191 en el primer byte).
- **Dos bytes restantes:** identifican los hosts.
- **Máscara por defecto:** `255.255.0.0`
- **Hosts por red:** 2¹⁶ − 2 = **65.534**
- Para organizaciones medianas-grandes.
- Ejemplo: `172.16.0.0`

### Clase C

- **Tres primeros bytes:** identifican la red (rango del 192 al 223 en el primer byte).
- **Un byte:** identifica los hosts.
- **Máscara por defecto:** `255.255.255.0`
- **Hosts por red:** 2⁸ − 2 = **254**
- Para redes pequeñas (la más habitual en redes domésticas o de oficina pequeña).
- Ejemplo: `192.168.1.0`

### ¿Por qué se restan 2 hosts?

Porque en cada red hay dos direcciones reservadas:

- **La primera dirección** (todos los bits de host a 0): identifica a la propia red. Ej: `192.168.1.0`.
- **La última dirección** (todos los bits de host a 1): es la dirección de **broadcast** (difusión a todos los dispositivos de la red). Ej: `192.168.1.255`.

### ¿Por qué existen las clases?

Fueron diseñadas para organizar el reparto de direcciones según el tamaño de cada organización. Sin embargo, este sistema resultó ineficiente (una Clase A desperdicia millones de direcciones si no se usan todas), por lo que hoy se usa CIDR (Classless Inter-Domain Routing) y subnetting para dividir las redes de forma más flexible.

---

## 8. Máscaras de Subred y Subnetting

### Máscara de subred

La máscara indica qué parte de la dirección IP corresponde a la red y cuál al host. En binario, los **1s** señalan la parte de red y los **0s** la parte de host. Siempre son consecutivos.

Ejemplo con clase C: `255.255.255.0` → en binario: `11111111.11111111.11111111.00000000` (24 bits de red, 8 de host).

Para saber a qué red pertenece un host, se hace un **AND lógico** entre la IP y la máscara.

### Subnetting

Subnetting consiste en "tomar prestados" bits de la parte de host para crear subredes dentro de una red. Esto permite dividir una red grande en varias más pequeñas.

**Fórmula de subredes:** N = 2ⁿ (donde n = bits tomados del host).

**Fórmula de hosts por subred:** H = 2ʰ − 2 (donde h = bits que quedan para host).

**Se detecta subnetting** cuando la máscara tiene un valor distinto de 0 o 255 en alguno de sus octetos (por ejemplo `255.255.240.0` o `255.255.255.224`).

### Ejemplo rápido

Red clase B: `145.54.0.0` con máscara `255.255.240.0`

- En binario la máscara es: `11111111.11111111.11110000.00000000`
- Se toman 4 bits de host → 2⁴ = **16 subredes**
- Quedan 12 bits de host → 2¹² − 2 = **4094 hosts por subred**
- Las subredes van de 16 en 16 en el tercer octeto: `145.54.0.0`, `145.54.16.0`, `145.54.32.0`… hasta `145.54.240.0`.

---

## 9. Resumen Rápido de Conceptos

| Concepto | ¿Qué es? |
|---|---|
| **IP Privada** | Dirección interna de tu red local, asignada por el router |
| **IP Pública** | Dirección visible en Internet, asignada por tu ISP |
| **NAT** | Traduce IPs privadas a la IP pública del router para salir a Internet |
| **CG-NAT** | NAT del ISP: te da IP privada en vez de pública, compartida con otros clientes |
| **DHCP** | Protocolo que asigna IPs automáticamente al conectarse a la red |
| **IPv4** | 32 bits, ~4.300M direcciones, se están agotando |
| **IPv6** | 128 bits, direcciones prácticamente infinitas, cada dispositivo puede tener IP pública |
| **Máscara** | Define qué bits son red y cuáles son host |
| **Subnetting** | Dividir una red en subredes tomando bits de host |
| **Broadcast** | Última IP de una red, envía mensaje a todos los dispositivos de esa red |
| **Gateway** | Puerta de enlace (normalmente el router), conecta tu red local con el exterior |