# Guía Paso a Paso: Cómo Calcular Máscaras y Hacer Subnetting

---

## Paso 0: Lo que necesitas dominar antes

### Potencias de 2 (memorízalas)

| 2⁰ | 2¹ | 2² | 2³ | 2⁴ | 2⁵ | 2⁶ | 2⁷ | 2⁸ | 2⁹ | 2¹⁰ | 2¹¹ | 2¹² |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 |

### Valores de cada bit en un byte (de izquierda a derecha)

```
Posición:    7     6     5     4     3     2     1     0
Valor:      128    64    32    16     8     4     2     1
```

### Máscaras posibles en un octeto

Recuerda: los 1s siempre van a la izquierda, los 0s a la derecha. Nunca se mezclan.

| Binario | Decimal | Bits de red en este octeto |
|---|---|---|
| `00000000` | 0 | 0 |
| `10000000` | 128 | 1 |
| `11000000` | 192 | 2 |
| `11100000` | 224 | 3 |
| `11110000` | 240 | 4 |
| `11111000` | 248 | 5 |
| `11111100` | 252 | 6 |
| `11111110` | 254 | 7 |
| `11111111` | 255 | 8 |

**Esta tabla es clave. Si la memorizas, resolverás ejercicios mucho más rápido.**

---

## Ejemplo 1 (sencillo): Dado un número de hosts, encontrar la máscara

### Enunciado

Necesitas una red que soporte **50 equipos**. ¿Qué máscara necesitas?

### Resolución paso a paso

**Paso 1:** Busca la potencia de 2 más pequeña que, restándole 2, cubra los 50 hosts.

¿Por qué restar 2? Porque la primera IP es la dirección de red y la última es broadcast.

- 2⁵ = 32 → 32 − 2 = 30 hosts → **no alcanza** (necesitamos 50)
- 2⁶ = 64 → 64 − 2 = 62 hosts → **sí alcanza**

Necesitamos **6 bits para hosts**.

**Paso 2:** Si 6 bits son para hosts, el resto son para red. Una IP tiene 32 bits en total:

32 − 6 = **26 bits de red** → la máscara es **/26**

**Paso 3:** Convierte /26 a decimal. 26 bits de 1 seguidos de 6 bits de 0:

```
11111111.11111111.11111111.11000000
   255   .   255  .   255  .  192
```

**Resultado:** Máscara = `255.255.255.192` o `/26`, con capacidad para 62 hosts.

---

## Ejemplo 2 (sencillo): Dada una IP y máscara, encontrar red, broadcast y rango

### Enunciado

IP: `192.168.1.130` con máscara `255.255.255.192` (/26). ¿A qué red pertenece? ¿Cuál es el broadcast? ¿Cuál es el rango de hosts válidos?

### Resolución paso a paso

**Paso 1:** Identifica el octeto "interesante" (donde la máscara no es 255 ni 0).

- Octeto 1: 255 → todo red → se queda igual: **192**
- Octeto 2: 255 → todo red → se queda igual: **168**
- Octeto 3: 255 → todo red → se queda igual: **1**
- Octeto 4: 192 → **este es el interesante**

**Paso 2:** Calcula el "salto" (tamaño de bloque) de las subredes.

Salto = 256 − valor de máscara en el octeto interesante = 256 − 192 = **64**

Esto significa que las subredes van de 64 en 64 en el cuarto octeto:
- Subred 0: `192.168.1.0`
- Subred 1: `192.168.1.64`
- Subred 2: `192.168.1.128`
- Subred 3: `192.168.1.192`

**Paso 3:** ¿En cuál cae nuestra IP (130)?

130 está entre 128 y 192, así que pertenece a la subred que empieza en 128.

**Paso 4:** Calcula todo para esa subred:

- **Dirección de red:** `192.168.1.128`
- **Primer host:** `192.168.1.129`
- **Último host:** `192.168.1.190` (broadcast − 1)
- **Broadcast:** `192.168.1.191` (siguiente subred − 1 = 192 − 1 = 191)

> **Truco rápido para el broadcast:** la siguiente subred empieza en 192, así que el broadcast es 192 − 1 = 191.

---

## Ejemplo 3 (intermedio): Subnetting cuando el octeto interesante no es el cuarto

### Enunciado

IP: `172.16.45.100` con máscara `255.255.240.0` (/20). Encuentra red, broadcast y rango.

### Resolución

**Paso 1:** Octeto interesante = tercer octeto (240, que no es 255 ni 0).

**Paso 2:** Salto = 256 − 240 = **16** (las subredes van de 16 en 16 en el **tercer** octeto).

Subredes: `172.16.0.0`, `172.16.16.0`, `172.16.32.0`, `172.16.48.0`, etc.

**Paso 3:** Nuestro tercer octeto es 45. ¿Entre qué múltiplos de 16 cae?

32 ≤ 45 < 48 → la subred empieza en **32**.

**Paso 4:** Resultados:

- **Dirección de red:** `172.16.32.0`
- **Primer host:** `172.16.32.1`
- **Broadcast:** `172.16.47.255` (siguiente subred 48, menos 1 → 47.255)
- **Último host:** `172.16.47.254`
- **Hosts disponibles:** 2¹² − 2 = 4094

> **¿Por qué 47.255?** Porque la siguiente subred es `172.16.48.0`. Un paso antes es `172.16.47.255`. Los octetos a la derecha del interesante se ponen todos a 255 en el broadcast.

---

## Ejemplo 4 (el de tu ejercicio): Encontrar la red a partir del número de hosts

### Enunciado

Se segmenta una red S en redes A y B:
- La IP `190.146.3.200` pertenece a la red A, que puede contener **511 equipos**.
- La IP `190.146.11.111` pertenece a la red B, que puede contener **1024 equipos**.
- S es la red más pequeña que contiene a A y B.

Encontrar red, máscara y broadcast de A, B y S.

### Resolución de la Red A

**Paso 1:** ¿Cuántos bits de host necesitamos para 511 equipos?

- 2⁸ = 256 → 256 − 2 = 254 → no alcanza
- 2⁹ = 512 → 512 − 2 = 510 → no alcanza (necesitamos 511 exactos)
- 2¹⁰ = 1024 → 1024 − 2 = 1022 → **sí alcanza**

Necesitamos **10 bits de host**.

**Paso 2:** Máscara = 32 − 10 = **/22** → `255.255.252.0`

Verificación en binario: `11111111.11111111.11111100.00000000` (22 unos, 10 ceros ✓)

**Paso 3:** Octeto interesante = tercer octeto (252). Salto = 256 − 252 = **4**.

Subredes en el tercer octeto: 0, 4, 8, 12, 16…

**Paso 4:** Nuestro tercer octeto es 3. ¿Dónde cae? 0 ≤ 3 < 4 → subred **0**.

**Resultados Red A:**
- **Red:** `190.146.0.0 /22`
- **Máscara:** `255.255.252.0`
- **Broadcast:** `190.146.3.255` (siguiente subred es 4.0, menos 1 → 3.255)

### Resolución de la Red B

**Paso 1:** ¿Cuántos bits para 1024 equipos?

- 2¹⁰ = 1024 → 1024 − 2 = 1022 → no alcanza para 1024
- 2¹¹ = 2048 → 2048 − 2 = 2046 → **sí alcanza**

Necesitamos **11 bits de host**.

**Paso 2:** Máscara = 32 − 11 = **/21** → `255.255.248.0`

Binario: `11111111.11111111.11111000.00000000` (21 unos, 11 ceros ✓)

**Paso 3:** Octeto interesante = tercer octeto (248). Salto = 256 − 248 = **8**.

Subredes en el tercer octeto: 0, 8, 16, 24…

**Paso 4:** Nuestro tercer octeto es 11. ¿Dónde cae? 8 ≤ 11 < 16 → subred **8**.

**Resultados Red B:**
- **Red:** `190.146.8.0 /21`
- **Máscara:** `255.255.248.0`
- **Broadcast:** `190.146.15.255` (siguiente subred es 16.0, menos 1 → 15.255)

### Resolución de la Red S (supernetting / red contenedora)

S debe ser la red **más pequeña** que contenga tanto a A (`190.146.0.0 – 190.146.3.255`) como a B (`190.146.8.0 – 190.146.15.255`).

**Paso 1:** S debe cubrir desde `190.146.0.x` hasta `190.146.15.x`. Es decir, necesita cubrir 16 valores en el tercer octeto (del 0 al 15).

**Paso 2:** ¿Qué máscara produce un salto de 16 en el tercer octeto?

256 − máscara = 16 → máscara del tercer octeto = **240**

Máscara completa: `255.255.240.0` = **/20**

**Paso 3:** Verificamos que `190.146.0.0` sea un inicio válido de subred /20:

Salto 16 en tercer octeto → subredes: 0, 16, 32… → Sí, 0 es inicio válido. ✓

**Resultados Red S:**
- **Red:** `190.146.0.0 /20`
- **Máscara:** `255.255.240.0`
- **Broadcast:** `190.146.15.255`

---

## Resumen del Método (tu "receta" para cualquier ejercicio)

### Si te dan número de hosts → encontrar máscara

1. Busca la potencia de 2 más pequeña donde 2ⁿ − 2 ≥ hosts pedidos.
2. Esos n bits son los de host. Máscara = 32 − n.

### Si te dan IP + máscara → encontrar red y broadcast

1. Identifica el octeto interesante (donde la máscara no es 255 ni 0).
2. Calcula el salto: 256 − valor de máscara en ese octeto.
3. Busca el múltiplo del salto que esté justo por debajo (o igual) al valor del octeto interesante de tu IP → eso es la dirección de red en ese octeto.
4. Broadcast = siguiente múltiplo − 1, con los octetos restantes a 255.

### Notación CIDR (/XX) → decimal rápido

| /24 | /25 | /26 | /27 | /28 | /29 | /30 |
|---|---|---|---|---|---|---|
| 255.255.255.0 | .128 | .192 | .224 | .240 | .248 | .252 |

| /16 | /17 | /18 | /19 | /20 | /21 | /22 | /23 |
|---|---|---|---|---|---|---|---|
| 255.255.0.0 | 255.255.128.0 | .192.0 | .224.0 | .240.0 | .248.0 | .252.0 | .254.0 |

---

## Ejercicio de práctica (inténtalo tú)

**Enunciado:** La IP `10.1.100.50` tiene máscara `/19`. Calcula la dirección de red, el broadcast y el número de hosts válidos.

**Pistas:**
- /19 = `255.255.224.0`
- Octeto interesante: el tercero (224)
- Salto: 256 − 224 = 32

**Solución:**
- Red: `10.1.96.0` (porque 96 ≤ 100 < 128, y 96 es múltiplo de 32)
- Broadcast: `10.1.127.255` (siguiente subred 128.0, menos 1)
- Hosts: 2¹³ − 2 = 8190