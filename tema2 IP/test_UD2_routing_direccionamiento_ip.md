# Test — UD2: Routing y Direccionamiento IP

**15 preguntas · nivel alto · respuestas y explicaciones al final**

> Algunas preguntas son de **respuesta única** y otras de **multirrespuesta** (marca *todas* las correctas). Lo indica la etiqueta de cada pregunta.

---

### 1. NET ID / HOST ID · respuesta única

¿Qué determina cuántos bits de una dirección IPv4 corresponden al NET ID y cuántos al HOST ID?

- A) El servidor DHCP lo reparte al azar según los dispositivos que haya conectados en ese momento
- B) Siempre el primer octeto es red y los tres restantes son host, en cualquier dirección
- C) La clase de la red o, de forma más precisa, la máscara de subred aplicada
- D) El número de hosts activos: cuantos más haya, más bits se asignan al NET ID

---

### 2. NET ID / operación AND · respuesta única

¿Cuál de estas afirmaciones sobre el NET ID y el HOST ID es CORRECTA?

- A) El HOST ID es el que identifica la red a la que pertenece el dispositivo
- B) Para obtener el NET ID se aplica un OR lógico entre la IP y la máscara
- C) En binario, los 1s de la máscara marcan la parte de host y los 0s la de red
- D) Para saber a qué red pertenece un host se aplica un AND lógico entre la IP y la máscara

---

### 3. IP privadas · multirrespuesta

Selecciona TODAS las direcciones que son privadas:

- A) `10.255.255.254`
- B) `172.32.5.1`
- C) `192.168.0.10`
- D) `172.20.16.4`

---

### 4. Rangos por clase · respuesta única

Sobre el rango del PRIMER octeto de cada clase, ¿cuál es correcta?

- A) Clase A abarca del 1 al 126, porque el 127 queda reservado
- B) Clase A: del 1 al 127, incluyendo el 127
- C) Clase B: del 128 al 192
- D) Clase C: del 1 al 223

---

### 5. Pública vs privada · respuesta única

¿Cuál describe correctamente el propósito de la IP pública frente a la privada?

- A) La privada la asigna el ISP y la pública la asigna el router a cada dispositivo de la LAN
- B) La privada identifica al dispositivo dentro de la red local; la pública es la "cara" de toda la red hacia Internet, asignada por el ISP al router
- C) Cada dispositivo de tu casa tiene su propia IP pública única para salir a Internet
- D) La pública solo tiene sentido dentro de tu red local y la privada es visible en Internet

---

### 6. NAT (definición) · respuesta única

¿Cuál es la definición CORRECTA de NAT?

- A) Un protocolo que cifra el tráfico entre tu router y el ISP para anonimizar la conexión
- B) El protocolo que asigna automáticamente direcciones IP a los dispositivos al conectarse a la red
- C) Un sistema que convierte direcciones IPv4 en IPv6 para alargar la vida útil del direccionamiento
- D) Un mecanismo que permite que varios dispositivos con IP privada salgan a Internet a través de una única IP pública

---

### 7. NAT (funcionamiento) · respuesta única

¿Cuál describe MEJOR cómo funciona NAT? (ojo: hay una que casi cuela)

- A) El router reenvía el paquete sin tocarlo y es el ISP quien cambia la IP de origen por la pública
- B) El router sustituye la IP privada de origen por su IP pública y anota en una tabla qué dispositivo pidió, para reenviarle la respuesta correcta
- C) El router cambia la IP privada por la pública, pero como no guarda registro, al volver la respuesta la difunde por broadcast a todos los dispositivos
- D) El router asigna una IP pública distinta a cada dispositivo durante el tiempo que dure la conexión

---

### 8. NAT (razón de ser) · respuesta única

¿Por qué existe NAT principalmente?

- A) Para aumentar la velocidad de la conexión repartiendo el tráfico entre varias IPs
- B) Porque IPv6 lo exige como paso previo obligatorio para conectarse a Internet
- C) Porque las direcciones IPv4 son limitadas (~4.300 millones) y no hay suficientes públicas para cada dispositivo del mundo
- D) Para cumplir la normativa que obliga a ocultar las IPs privadas por seguridad

---

### 9. CG-NAT · respuesta única

¿Qué caracteriza al CG-NAT (Carrier-Grade NAT)?

- A) El ISP te asigna una IP privada y aplica un segundo NAT, de forma que varios clientes comparten una misma IP pública
- B) El ISP asigna una IP pública dedicada y exclusiva a cada cliente
- C) Es exactamente el NAT que hace tu router doméstico con tus dispositivos, sin nada más
- D) Es un protocolo de operador que sustituye a DHCP en las redes de los clientes

---

### 10. CG-NAT (detección) · respuesta única

¿Cómo sabes si estás detrás de CG-NAT?

- A) Si tu IP cambia cada vez que reinicias el router, señal inequívoca de CG-NAT
- B) Si puedes abrir puertos sin problema para juegos o cámaras IP
- C) Si la IP WAN de tu router coincide exactamente con la que muestra "cuál es mi IP"
- D) Si la IP WAN de tu router es DISTINTA de la que muestra "cuál es mi IP", porque hay un NAT extra en el ISP

---

### 11. DHCP · multirrespuesta

Cuando un dispositivo se conecta, ¿qué le proporciona el servidor DHCP? (Selecciona TODAS)

- A) Una dirección IP privada disponible del rango configurado
- B) La máscara de subred
- C) La puerta de enlace (gateway), que es la IP del router
- D) Los servidores DNS
- E) La IP pública que el ISP asigna al router

---

### 12. IP estática vs dinámica · respuesta única

¿Para qué se usa típicamente una IP estática (fija)?

- A) Para los portátiles y móviles de usuario, porque así se conectan más rápido al WiFi
- B) Para reducir el consumo de direcciones del rango DHCP en redes grandes
- C) Para servidores (web, correo, DNS, FTP…) que necesitan ser siempre localizables en la misma dirección
- D) Para los dispositivos que se conectan de forma temporal y luego se desconectan

---

### 13. IPv4 vs IPv6 · respuesta única

¿Cuál es correcta sobre IPv4 e IPv6?

- A) IPv4 usa 64 bits e IPv6 usa 128 bits
- B) IPv4 usa 32 bits (~4.300 millones de direcciones) e IPv6 usa 128 bits (prácticamente infinitas)
- C) IPv6 usa 32 bits, pero con NAT obligatorio para ampliar el rango
- D) Ambos usan 32 bits, pero IPv6 comprime las direcciones para que parezcan más

---

### 14. Hosts por red / regla del −2 · respuesta única

Una red de Clase B por defecto, ¿cuántos hosts útiles admite y por qué?

- A) 2²⁴ − 2 = 16.777.214, porque tiene 24 bits de host
- B) 2⁸ − 2 = 254, porque solo el último octeto es de host
- C) 2¹⁶ = 65.536, ya que se aprovechan todos los 16 bits de host
- D) 2¹⁶ − 2 = 65.534, restando la dirección de red y la de broadcast

---

### 15. Clases vs CIDR · respuesta única

¿Por qué, en la práctica, se sustituyó el sistema de clases por CIDR y subnetting?

- A) Porque las clases eran inseguras y CIDR cifra las direcciones de red
- B) Porque el sistema de clases era ineficiente (una Clase A desperdicia millones de direcciones) y CIDR permite dividir las redes de forma mucho más flexible
- C) Porque CIDR solo funciona con IPv6 y las clases solo con IPv4
- D) Porque CIDR elimina por completo la necesidad de usar máscaras de subred

---
---

# Soluciones

| Pregunta | Respuesta(s) correcta(s) |
|:---:|:---:|
| 1 | C |
| 2 | D |
| 3 | A, C, D |
| 4 | A |
| 5 | B |
| 6 | D |
| 7 | B |
| 8 | C |
| 9 | A |
| 10 | D |
| 11 | A, B, C, D |
| 12 | C |
| 13 | B |
| 14 | D |
| 15 | B |

---

## Explicaciones

**1 → C.** Depende de la clase o, con más precisión, de la máscara de subred. La opción del "primer octeto = red" solo es cierta para la máscara por defecto de Clase A; en general no vale.

**2 → D.** La red se obtiene con un AND lógico entre IP y máscara. En la máscara los 1s = red y los 0s = host (la C lo dice al revés), y es el NET ID (no el HOST ID) el que identifica la red.

**3 → A, C, D.** El rango privado de Clase B llega hasta `172.31.x.x`, así que `172.32.5.1` ya NO es privada (trampa clásica). Las otras tres caen en `10.0.0.0/8`, `192.168.0.0/16` y `172.16–172.31`.

**4 → A.** Clase A es 1–126 (el 127 está reservado, p. ej. loopback `127.0.0.1`). Clase B es 128–191 (no 192) y Clase C es 192–223.

**5 → B.** La privada es interna (asignada por el router) y la pública es la que el ISP da al router; todos los dispositivos salen a Internet con esa misma pública. Las demás invierten quién asigna qué o quién es visible.

**6 → D.** NAT = traducir IPs privadas a la IP pública del router para compartir una sola salida. La A lo confunde con cifrado/VPN, la B describe DHCP y la C describe una "traducción" de versión que no es lo que hace NAT.

**7 → B.** La clave es la TABLA de traducción: sin ella el router no sabría a quién devolver la respuesta. La C es la "regulera": acierta en el cambio de IP pero se inventa el broadcast (no se ajusta a la realidad). La A traslada el trabajo al ISP y la D contradice el sentido de NAT.

**8 → C.** Es un parche al agotamiento de IPv4: millones de dispositivos comparten muchas menos IPs públicas. El "efecto cortafuegos" es un beneficio colateral, no su razón de existir.

**9 → A.** Hay doble NAT: el de tu router + el del ISP. Por eso lo que tú crees tu "IP pública" es en realidad privada dentro de la red del operador, compartida con otros clientes.

**10 → D.** Comparas la IP WAN del router con la de "cuál es mi IP". Si NO coinciden, hay traducción adicional del ISP → estás en CG-NAT. La A confunde CG-NAT con IP dinámica, y la B es justo lo que el CG-NAT te impide hacer.

**11 → A, B, C, D.** DHCP entrega IP + máscara + gateway + DNS. La IP pública del ISP (E) no la reparte el DHCP de tu router a los dispositivos; esa la negocia el router con el operador.

**12 → C.** Servidores = IP fija porque deben estar siempre en la misma dirección. Los dispositivos de usuario van con IP dinámica (DHCP), justo lo contrario de las opciones A y D.

**13 → B.** IPv4 = 32 bits (~4.300 millones); IPv6 = 128 bits (3,4 × 10³⁸). Con IPv6 cada dispositivo puede tener su propia pública y la necesidad de NAT desaparece en teoría.

**14 → D.** Clase B = 16 bits de host → 2¹⁶ − 2 = 65.534. Se restan 2 porque la primera dirección (host a 0) es la de red y la última (host a 1) es la de broadcast. La A es Clase A y la B es Clase C: trampas para quien confunde clases.

**15 → B.** Las clases repartían en bloques rígidos y desperdiciaban direcciones. CIDR (Classless Inter-Domain Routing) + subnetting permiten ajustar el tamaño de cada red con máscaras flexibles; precisamente usa máscaras, no las elimina.
