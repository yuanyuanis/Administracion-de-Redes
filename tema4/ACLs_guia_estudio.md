# Tema 4 — ACLs (Listas de Control de Acceso)

> Apuntes de estudio para repasar ACLs en routers y switches Cisco.  
> Objetivo: entender qué son, para qué sirven, cómo se leen y qué cosas suelen caer en tipo test.

---

## 1. Idea principal: ¿qué es una ACL?

Una **ACL** (*Access Control List*) es una **lista secuencial de reglas** que indican si un paquete debe ser:

- **permitido** (`permit`)
- **denegado** (`deny`)

Cada regla individual de una ACL se llama **ACE** (*Access Control Entry*).

Una ACL sirve para hacer **filtrado de paquetes**. Es decir, el router o switch de capa 3 analiza el tráfico y decide si lo deja pasar o lo descarta.

### Frase para memorizar

> Una ACL es una lista ordenada de instrucciones `permit` y `deny` que controla qué tráfico puede pasar por una interfaz.

---

## 2. ¿Para qué sirven las ACLs?

Las ACLs sirven para controlar tráfico en la red. Se pueden usar para:

1. **Filtrar tráfico entre redes o VLANs**
   - Ejemplo: permitir que invitados salgan a Internet, pero impedir que entren en la red de contabilidad.

2. **Proteger interfaces de gestión**
   - Ejemplo: permitir SSH al router solo desde la IP del administrador.

3. **Controlar acceso a servicios**
   - Ejemplo: bloquear Telnet, permitir HTTPS, permitir SMTP, etc.

4. **Clasificar tráfico para QoS**
   - Ejemplo: detectar tráfico de voz o videollamada para darle prioridad.

5. **Seleccionar tráfico para NAT**
   - Ejemplo: decir qué redes privadas se traducen para salir a Internet.

6. **Restringir actualizaciones de routing**
   - Ejemplo: aceptar rutas solo desde routers de confianza.

### Frase para memorizar

> Las ACLs traducen una política de seguridad en reglas técnicas aplicadas en routers o switches de capa 3.

---

## 3. Crear una ACL no basta: hay que aplicarla

Una ACL puede estar creada en la configuración del router, pero **no hace nada hasta que se aplica a una interfaz**.

Ejemplo:

```cisco
access-list 1 permit 10.1.1.0 0.0.0.255
```

Esto crea la ACL, pero todavía **no filtra tráfico**.

Para que tenga efecto:

```cisco
interface Ethernet0/0
ip access-group 1 in
```

Esto significa:

> Aplica la ACL 1 en la interfaz Ethernet0/0 en sentido de entrada.

### Frase para memorizar

> ACL creada no filtra; ACL aplicada sí filtra.

---

## 4. IN y OUT: sentido del tráfico

El sentido siempre se entiende **desde el punto de vista del router**.

### `in` / inbound / entrada

El paquete **entra al router** por esa interfaz.

La ACL se evalúa **antes del enrutamiento**.

Ventaja:

- Si el paquete se deniega, se descarta enseguida.
- Es más eficiente porque el router no pierde tiempo enrutando tráfico que va a tirar.

### `out` / outbound / salida

El paquete **sale del router** por esa interfaz.

La ACL se evalúa **después del enrutamiento**, justo antes de transmitir el paquete.

Desventaja:

- El router ya ha procesado el paquete.
- Consume más recursos.

### Frase para memorizar

> `in` significa que el paquete entra al router.  
> `out` significa que el paquete sale del router.  
> Siempre se mira desde la perspectiva del router.

---

## 5. Orden de procesamiento de una ACL

Las ACLs se procesan **de arriba abajo**.

El router compara el paquete con la primera regla.  
Si coincide, aplica la acción y **deja de mirar el resto**.  
Si no coincide, pasa a la siguiente.

### Clave

> Primera coincidencia gana.

Ejemplo:

```cisco
10 deny tcp host 190.146.100.3 any eq 22
20 permit ip any any
```

El router hace esto:

1. ¿Es tráfico TCP desde `190.146.100.3` hacia cualquier destino en puerto 22?
   - Sí → lo bloquea.
   - No → pasa a la siguiente regla.

2. ¿Es cualquier otro tráfico IP?
   - Sí → lo permite.

### Frase para memorizar

> El orden de las reglas es fundamental. Una regla general colocada antes puede impedir que se evalúen reglas más específicas posteriores.

---

## 6. Denegación implícita

Toda ACL tiene al final una regla invisible:

```cisco
deny ip any any
```

Esto significa:

> Todo lo que no se haya permitido antes queda bloqueado.

Ejemplo peligroso:

```cisco
access-list 101 deny tcp host 190.146.100.3 any eq 22
```

Parece que solo bloquea SSH desde esa IP, pero en realidad, por la denegación implícita, también bloquea todo lo demás.

Equivale a:

```cisco
access-list 101 deny tcp host 190.146.100.3 any eq 22
access-list 101 deny ip any any
```

Si quieres bloquear solo SSH y permitir el resto, necesitas:

```cisco
access-list 101 deny tcp host 190.146.100.3 any eq 22
access-list 101 permit ip any any
```

### Frases de tipo test

> Toda ACL termina con un `deny` implícito.  
> Una ACL sin ningún `permit` bloqueará todo el tráfico.  
> Si un paquete no coincide con ninguna entrada, será descartado.

---

## 7. Máscaras inversas o wildcard masks

Las ACLs Cisco no suelen usar `/24`, `/16`, etc.  
Usan **máscaras inversas**, también llamadas **wildcard masks**.

La wildcard sirve para decirle al router:

> Qué parte de la IP debe coincidir y qué parte puede ignorar.

### Regla mental

```text
0 = tiene que coincidir
1 = me da igual
```

En decimal:

```text
0   = mira / debe coincidir
255 = ignora / puede ser cualquier valor
```

---

## 8. ¿Para qué sirven las máscaras inversas?

Sirven para aplicar una regla a:

- una IP concreta
- una red completa
- un rango de direcciones

Sin wildcard, tendrías que escribir IP por IP.

Ejemplo:

```cisco
access-list 10 permit 192.168.1.0 0.0.0.255
```

Esto significa:

> Permite cualquier IP de la red `192.168.1.0/24`.

Coincide con:

```text
192.168.1.1
192.168.1.2
192.168.1.50
192.168.1.200
192.168.1.254
```

Porque:

```text
192.168.1.0 0.0.0.255
```

se interpreta como:

```text
192 → debe coincidir
168 → debe coincidir
1   → debe coincidir
X   → da igual
```

### Frase para memorizar

> La wildcard permite filtrar redes enteras sin escribir cada IP individual.

---

## 9. Cómo calcular una wildcard

Se calcula restando la máscara normal a:

```text
255.255.255.255
```

Ejemplo `/24`:

```text
255.255.255.255
-255.255.255.0
----------------
0.0.0.255
```

Por tanto:

```text
/24 = 255.255.255.0 = wildcard 0.0.0.255
```

Ejemplo `/28`:

```text
255.255.255.255
-255.255.255.240
----------------
0.0.0.15
```

Por tanto:

```text
/28 = 255.255.255.240 = wildcard 0.0.0.15
```

---

## 10. Wildcards típicas para memorizar

| Red | Máscara normal | Wildcard |
|---|---:|---:|
| `/8` | `255.0.0.0` | `0.255.255.255` |
| `/16` | `255.255.0.0` | `0.0.255.255` |
| `/24` | `255.255.255.0` | `0.0.0.255` |
| `/28` | `255.255.255.240` | `0.0.0.15` |
| `/32` | `255.255.255.255` | `0.0.0.0` |

---

## 11. `host` y `any`

Cisco permite abreviaciones.

### `host`

```cisco
host 10.1.1.2
```

equivale a:

```cisco
10.1.1.2 0.0.0.0
```

Significa:

> Solo esa IP exacta.

### `any`

```cisco
any
```

equivale a:

```cisco
0.0.0.0 255.255.255.255
```

Significa:

> Cualquier IP.

### Frases para memorizar

> `host IP` equivale a `IP 0.0.0.0`.  
> `any` equivale a `0.0.0.0 255.255.255.255`.

---

## 12. ACL estándar

Una ACL estándar filtra **solo por IP de origen**.

No mira:

- destino
- protocolo
- puerto
- TCP
- UDP
- ICMP

### Rangos de numeración

```text
1–99
1300–1999
```

### Sintaxis general

```cisco
access-list número permit|deny origen wildcard
```

Ejemplo:

```cisco
access-list 1 permit 10.1.1.0 0.0.0.255
```

Traducción:

> Permite tráfico cuyo origen esté en la red `10.1.1.0/24`.

Aplicación:

```cisco
interface Ethernet0/0
ip access-group 1 in
```

### Dónde colocar ACL estándar

Como solo mira origen, es poco precisa.

Por eso:

> Las ACL estándar se colocan cerca del destino.

---

## 13. ACL extendida

Una ACL extendida filtra por más criterios:

- IP de origen
- IP de destino
- protocolo
- puerto de origen
- puerto de destino
- tipo ICMP
- TCP, UDP, IP, ICMP, etc.

### Rangos de numeración

```text
100–199
2000–2699
```

### Sintaxis general

```cisco
access-list número permit|deny protocolo origen wildcard destino wildcard [puerto]
```

Ejemplo:

```cisco
access-list 101 permit ip 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255
```

Esto significa:

> Permite cualquier tráfico IP desde la red `10.1.1.0/24` hacia la red `172.16.1.0/24`.

La estructura es:

```text
access-list 101 permit ip ORIGEN WILDCARD_ORIGEN DESTINO WILDCARD_DESTINO
```

Desmontado:

```text
access-list 101       → ACL extendida número 101
permit                → permitir
ip                    → todo tráfico IP
10.1.1.0 0.0.0.255    → origen: red 10.1.1.0/24
172.16.1.0 0.0.0.255  → destino: red 172.16.1.0/24
```

### Dónde colocar ACL extendida

Como es precisa, se coloca:

> Cerca del origen.

Así se bloquea el tráfico no deseado cuanto antes.

---

## 14. `permit ip` vs `permit tcp` vs `permit udp`

### `permit ip`

```cisco
permit ip any any
```

Permite todo tráfico IP, incluyendo:

- TCP
- UDP
- ICMP
- ping
- DNS
- DHCP
- HTTP
- HTTPS
- SSH

### `permit tcp`

```cisco
permit tcp any any
```

Solo permite TCP.

No permite:

- UDP
- ICMP
- DHCP
- ping

### `permit udp`

```cisco
permit udp any any
```

Solo permite UDP.

No permite:

- TCP
- ICMP

### Regla de oro

> Usa `ip` si quieres permitir toda la comunicación.  
> Usa `tcp` o `udp` solo si quieres filtrar por protocolo o puerto concreto.

---

## 15. Ejemplo: bloquear SSH de un host y permitir lo demás

```cisco
access-list 101 deny tcp host 190.146.100.3 any eq 22
access-list 101 permit ip any any
```

Traducción:

1. Bloquea SSH desde `190.146.100.3` hacia cualquier destino.
2. Permite todo lo demás.

Desmontado:

```text
deny     → bloquear
tcp      → protocolo TCP
host     → una IP exacta
any      → cualquier destino
eq 22    → puerto 22, SSH
```

### Frase para memorizar

> Si bloqueo algo concreto y quiero dejar pasar el resto, necesito un `permit ip any any` al final.

---

## 16. Ejemplo: ACL 101 y ACL 102

### ACL 101: denegación implícita

```cisco
access-list 101 permit ip 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255
```

Esta ACL permite solo:

> Tráfico IP desde `10.1.1.0/24` hacia `172.16.1.0/24`.

Todo lo demás se bloquea por el `deny ip any any` implícito.

### ACL 102: denegación explícita

```cisco
access-list 102 permit ip 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255
access-list 102 deny ip any any
```

Funcionalmente hace lo mismo, pero la denegación final queda escrita.

### Diferencia

- ACL 101: el `deny` final está oculto.
- ACL 102: el `deny` final está escrito.

### Buena práctica

> Escribir explícitamente `deny ip any any` puede mejorar la legibilidad y auditoría de la configuración.

---

## 17. DHCP: la trampa típica

DHCP puede romperse con ACLs mal puestas.

Cuando un cliente aún no tiene IP, manda una solicitud con:

```text
origen: 0.0.0.0
destino: 255.255.255.255
protocolo: UDP
puerto origen: 68
puerto destino: 67
```

Si la ACL no permite este tráfico, el cliente no obtiene IP.

### Ejemplo de permisos DHCP

```cisco
permit udp any eq 68 any eq 67
permit udp any eq 67 any eq 68
```

### Frase para memorizar

> DHCP usa UDP 67/68 y puede usar origen `0.0.0.0` y destino `255.255.255.255`.

### Trampa de examen

Si una ACL bloquea DHCP:

- el PC no obtiene IP
- no hay ping
- parece que toda la red falla
- el problema real es la ACL

---

## 18. ICMP y ping

ICMP se usa, entre otras cosas, para `ping`.

Ejemplo:

```cisco
access-list 101 deny icmp any 10.1.1.0 0.0.0.255 echo
access-list 101 permit ip any 10.1.1.0 0.0.0.255
```

Esto bloquea pings entrantes no solicitados hacia `10.1.1.0/24`, pero permite otro tráfico IP hacia esa red.

Conceptos:

- `echo`: solicitud de ping.
- `echo-reply`: respuesta de ping.

---

## 19. ACLs nombradas

En vez de usar solo números, se pueden usar nombres.

Ejemplo:

```cisco
ip access-list extended BLOQUEA_BECARIO
 10 deny tcp host 190.146.100.3 any eq 22
 20 permit ip any any
```

Ventajas:

- Más legibles.
- Más fáciles de editar.
- Permiten usar números de secuencia.
- Permiten insertar reglas entre otras.

Ejemplo:

```cisco
15 deny icmp host 190.146.100.3 any
```

Esto se insertaría entre la línea 10 y la línea 20.

### Frase para memorizar

> Las ACL nombradas facilitan la edición porque permiten trabajar con números de secuencia.

---

## 20. Números de secuencia

Cisco IOS suele asignar números de secuencia de 10 en 10:

```cisco
10 permit tcp any any
20 permit udp any any
30 permit icmp any any
```

Esto permite insertar reglas intermedias.

Ejemplo: insertar una regla al principio:

```cisco
ip access-list extended 101
5 deny tcp any any eq telnet
```

Resultado:

```cisco
5 deny tcp any any eq telnet
10 permit tcp any any
20 permit udp any any
30 permit icmp any any
```

Ejemplo: insertar entre 15 y 20:

```cisco
ip access-list extended 101
18 permit tcp any host 172.16.2.11
```

### Frase para memorizar

> Los números de secuencia permiten insertar reglas sin borrar y recrear toda la ACL.

---

## 21. Editar ACLs numeradas

Hay varias formas de editar ACLs:

### 1. Borrar y recrear

```cisco
no access-list 101
```

Cuidado: borra la ACL completa.

### 2. Borrar una entrada concreta

```cisco
no access-list 101 deny icmp any any
```

Esto elimina solo esa línea si coincide exactamente.

### 3. Usar modo `ip access-list`

```cisco
ip access-list extended 101
```

Desde ahí puedes insertar líneas con número de secuencia.

### Buena práctica

> Antes de editar ACLs complejas, hacer backup o copiar la configuración a un editor de texto.

---

## 22. Verificación

Comando típico:

```cisco
show access-list
```

O:

```cisco
show ip access-lists
```

Sirve para:

- ver las reglas
- comprobar el orden
- ver contadores de coincidencias
- confirmar que la ACL está como esperas

### Frase para memorizar

> Después de modificar una ACL, siempre hay que verificar con `show access-list`.

---

## 23. Estándar vs extendida: comparación rápida

| Característica | ACL estándar | ACL extendida |
|---|---|---|
| Filtra por origen | Sí | Sí |
| Filtra por destino | No | Sí |
| Filtra por protocolo | No | Sí |
| Filtra por puerto | No | Sí |
| Es más precisa | No | Sí |
| Rango clásico | 1–99 | 100–199 |
| Rango ampliado | 1300–1999 | 2000–2699 |
| Ubicación recomendada | Cerca del destino | Cerca del origen |

---

## 24. Buenas prácticas

1. **Planificar antes de configurar**
   - Decide qué tráfico se permite y qué tráfico se bloquea.

2. **Colocar reglas específicas antes que reglas generales**
   - Primero hosts y puertos concretos.
   - Después redes o permisos generales.

3. **Recordar el deny implícito**
   - Todo lo no permitido queda bloqueado.

4. **Incluir permisos necesarios**
   - Especialmente DHCP, DNS, ICMP si son necesarios.

5. **Usar `ip` cuando quieras permitir todo**
   - No hagas reglas redundantes de TCP, UDP e ICMP si basta con `permit ip`.

6. **Aplicar estándar cerca del destino**
   - Porque solo mira origen.

7. **Aplicar extendida cerca del origen**
   - Porque es precisa y ahorra tráfico.

8. **Proteger accesos de gestión**
   - SSH, Telnet, SNMP, VTY.

9. **Verificar después de cambiar**
   - `show access-list`
   - pruebas de conectividad

---

## 25. Preguntas tipo test probables

### 1. Una ACL se procesa...

Respuesta:

> De arriba abajo, hasta la primera coincidencia.

---

### 2. Si un paquete no coincide con ninguna regla...

Respuesta:

> Se descarta por la denegación implícita.

---

### 3. Una ACL sin ningún `permit`...

Respuesta:

> Bloquea todo el tráfico.

---

### 4. Una ACL estándar filtra por...

Respuesta:

> Dirección IP de origen.

---

### 5. Una ACL extendida puede filtrar por...

Respuesta:

> Origen, destino, protocolo y puerto.

---

### 6. Las ACL estándar se colocan...

Respuesta:

> Cerca del destino.

---

### 7. Las ACL extendidas se colocan...

Respuesta:

> Cerca del origen.

---

### 8. `permit ip any any` significa...

Respuesta:

> Permitir todo el tráfico IP desde cualquier origen hacia cualquier destino.

---

### 9. `permit tcp any any` permite...

Respuesta:

> Solo tráfico TCP.

---

### 10. `host 10.1.1.2` equivale a...

Respuesta:

> `10.1.1.2 0.0.0.0`.

---

### 11. `any` equivale a...

Respuesta:

> `0.0.0.0 255.255.255.255`.

---

### 12. En una wildcard, un `0` significa...

Respuesta:

> El bit debe coincidir.

---

### 13. En una wildcard, un `1` significa...

Respuesta:

> El bit no importa.

---

### 14. La wildcard de `/24` es...

Respuesta:

> `0.0.0.255`.

---

### 15. DHCP usa...

Respuesta:

> UDP puertos 67 y 68.

---

### 16. El cliente DHCP puede usar como origen...

Respuesta:

> `0.0.0.0`.

---

### 17. El destino broadcast DHCP puede ser...

Respuesta:

> `255.255.255.255`.

---

### 18. `eq 22` indica...

Respuesta:

> Puerto 22, SSH.

---

### 19. `eq telnet` indica...

Respuesta:

> Telnet, puerto 23.

---

### 20. El comando para aplicar una ACL a una interfaz es...

Respuesta:

> `ip access-group número in|out`.

---

## 26. Chuleta final de memoria

```text
ACL = lista ordenada de permit/deny.
ACE = cada regla individual de la ACL.
Las ACLs filtran paquetes en capa 3 y capa 4.
Crear ACL no basta: hay que aplicarla.
Se aplica con ip access-group.
IN = entra al router.
OUT = sale del router.
Las reglas se leen de arriba abajo.
Primera coincidencia gana.
Al final hay deny implícito.
Sin permit, se bloquea todo.
ACL estándar = solo origen.
ACL extendida = origen, destino, protocolo y puerto.
Estándar cerca del destino.
Extendida cerca del origen.
Wildcard: 0 coincide, 1 da igual.
host IP = IP 0.0.0.0.
any = 0.0.0.0 255.255.255.255.
permit ip any any = permite todo IP.
permit tcp any any = solo TCP.
DHCP usa UDP 67/68.
Verificar con show access-list.
```

---

## 27. Mini explicación oral para soltar en examen

Una ACL es una lista secuencial de reglas `permit` y `deny` que se aplica en routers o switches de capa 3 para filtrar paquetes. Cada regla se llama ACE. El router evalúa las reglas de arriba abajo y, cuando encuentra la primera coincidencia, aplica la acción y deja de revisar la lista. Si un paquete no coincide con ninguna regla, se descarta por la denegación implícita final.

Las ACLs pueden ser estándar o extendidas. Las estándar solo filtran por IP de origen, por eso son menos precisas y se colocan cerca del destino. Las extendidas filtran por origen, destino, protocolo y puerto, por eso son más precisas y se colocan cerca del origen.

Una ACL no tiene efecto solo por existir: hay que aplicarla a una interfaz con `ip access-group`, indicando si se aplica en entrada `in` o salida `out`. `in` significa que el paquete entra al router y se filtra antes de enrutar; `out` significa que el paquete sale del router y se filtra después de enrutar.

Las máscaras inversas o wildcard masks se usan para indicar qué bits de una IP deben coincidir y cuáles se ignoran. Un cero significa que debe coincidir y un uno significa que da igual. Por eso `10.1.1.0 0.0.0.255` representa toda la red `10.1.1.0/24`, `host 10.1.1.2` representa una IP exacta y `any` representa cualquier dirección.

---

## 28. Ejemplos clave para practicar

### Permitir una red origen en ACL estándar

```cisco
access-list 1 permit 10.1.1.0 0.0.0.255
```

Permite tráfico cuyo origen sea `10.1.1.0/24`.

---

### Aplicar ACL estándar en entrada

```cisco
interface Ethernet0/0
ip access-group 1 in
```

Aplica la ACL 1 al tráfico que entra por Ethernet0/0.

---

### Permitir tráfico entre dos redes

```cisco
access-list 101 permit ip 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255
```

Permite todo tráfico IP desde `10.1.1.0/24` hacia `172.16.1.0/24`.

---

### Bloquear Telnet

```cisco
access-list 101 deny tcp any any eq telnet
access-list 101 permit ip any any
```

Bloquea Telnet y permite el resto.

---

### Bloquear SSH desde un host

```cisco
access-list 101 deny tcp host 190.146.100.3 any eq 22
access-list 101 permit ip any any
```

Bloquea SSH desde `190.146.100.3` hacia cualquier destino y permite el resto.

---

### ACL nombrada

```cisco
ip access-list extended BLOQUEA_BECARIO
 10 deny tcp host 190.146.100.3 any eq 22
 20 permit ip any any
```

ACL extendida con nombre y números de secuencia.

---

### Insertar regla intermedia

```cisco
ip access-list extended BLOQUEA_BECARIO
 15 deny icmp host 190.146.100.3 any
```

Inserta una regla entre la 10 y la 20.

---

## 29. Errores típicos

### Error 1: crear la ACL y no aplicarla

Problema:

```cisco
access-list 1 permit 10.1.1.0 0.0.0.255
```

Esto no filtra nada si no se aplica con:

```cisco
ip access-group 1 in
```

---

### Error 2: olvidar el deny implícito

Problema:

```cisco
access-list 101 deny tcp host 190.146.100.3 any eq 22
```

Esto no solo bloquea SSH. Bloquea todo lo demás por el deny implícito.

---

### Error 3: usar `tcp` pensando que es todo

Problema:

```cisco
permit tcp any any
```

Esto no permite UDP ni ICMP.

Si quieres permitir todo:

```cisco
permit ip any any
```

---

### Error 4: romper DHCP

Problema:

La ACL no permite tráfico UDP 67/68 ni origen `0.0.0.0`.

Resultado:

El cliente no obtiene IP.

---

### Error 5: poner reglas generales antes que específicas

Problema:

```cisco
10 permit ip any any
20 deny tcp host 10.1.1.2 any eq 23
```

La regla 20 nunca se ejecuta, porque la 10 ya permitió todo.

Correcto:

```cisco
10 deny tcp host 10.1.1.2 any eq 23
20 permit ip any any
```

---

## 30. Resumen final ultracorto

> ACL = reglas permit/deny.  
> Se leen de arriba abajo.  
> Primera coincidencia gana.  
> Al final hay deny implícito.  
> Hay que aplicar la ACL a una interfaz.  
> Estándar mira solo origen.  
> Extendida mira origen, destino, protocolo y puerto.  
> Wildcard: cero coincide, uno da igual.  
> `host` es una IP exacta.  
> `any` es cualquier IP.  
> `ip` incluye TCP, UDP e ICMP.  
> Cuidado con DHCP.  
> Verifica siempre con `show access-list`.
