# Routing — Apuntes para entenderlo, no para memorizarlo

> Te pones el gorrito de admin de red. Vas a ver cómo, **paso a paso, los problemas te empujan** hacia cada concepto que has visto en clase. Nada aparece porque sí.

---

## 1. El problema de partida: ¿por qué existe el routing?

Imagina que montas una oficina pequeña. 20 ordenadores, un switch, todos en `192.168.1.0/24`. Funciona. Los PCs se hablan entre sí porque están **en la misma red**.

¿Cómo se hablan? En **capa 2** (Ethernet), usando direcciones MAC. El PC1 quiere mandar algo al PC2 → grita por el cable "¿quién tiene la IP `192.168.1.5`?" (eso es **ARP**), el PC2 contesta con su MAC, y ya. El switch se entera de qué MAC está en qué puerto y reenvía. Fin.

**Aquí no hace falta ningún router.** Todo es local, todo es capa 2.

### Ahora la oficina crece

Llega el jefe y dice: "necesitamos separar a los de Contabilidad de los de Desarrollo, que no se vean entre sí. Y los servidores en otra zona". Tú, que has estudiado, dices:

> "Vale, hago **VLANs** en el switch. Una VLAN por departamento. Cada VLAN es una red lógica separada".

Perfecto. Has segmentado. Pero ahora aparece **el problema que da pie a todo**:

> **Los de Contabilidad no pueden imprimir en la impresora de Desarrollo. Y los servidores no son alcanzables desde ninguna VLAN.**

¿Por qué? Porque las VLANs **están aisladas a propósito**. En capa 2 son redes distintas. Un broadcast ARP de la VLAN de Contabilidad no llega a la de Desarrollo. **No se ven**.

Y entonces te das cuenta de algo:

> **Capa 2 (switches, MACs, VLANs) solo sabe moverse DENTRO de una red. Para saltar de una red a otra hace falta otra cosa.**

Esa "otra cosa" es **capa 3**, las **direcciones IP**, y el aparato que sabe saltar entre redes se llama **router**. Lo que hace el router se llama **routing** (o enrutamiento).

### La regla mental que lo resume todo

| Si quiero hablar con alguien de... | Me basta con... |
|------------------------------------|-----------------|
| ...mi misma red (mismo prefijo IP) | switch + MAC + ARP |
| ...otra red distinta | un **router** que conecte ambas |

**Por eso existe el routing.** Porque el mundo no es una sola red plana: está partido en miles de redes (tu casa, tu oficina, otra oficina, Google, tu banco...), y alguien tiene que **decidir por qué camino van los paquetes** para cruzar de una a otra.

Esto encaja con todo lo que has visto:

- **VLANs** → te separan la red en capa 2. Pero te crean el problema de "no se hablan entre sí" → necesitas routing.
- **Subredes** → segmentan en capa 3. Cada subred es una red distinta a efectos de IP → necesitas routing entre ellas.
- **NAT/PAT** → es un caso particular de routing donde además **traduces direcciones** (red privada ↔ Internet). El router está enrutando *y* reescribiendo IPs.
- **ACLs** → son reglas que el router (o switch L3) aplica para **decidir si deja pasar o no** un tráfico que está enrutando. Routing dice "por dónde", ACL dice "si lo dejo pasar".

> 🧠 **Mapa mental:** switching mueve dentro de la red, routing mueve entre redes, NAT traduce direcciones cuando saltas a otra red distinta, ACL filtra qué se enruta y qué no. Todo es la misma película, capas distintas.

---

## 2. ¿Qué hace exactamente un router?

Un router tiene varias interfaces (puertos), y **cada interfaz está conectada a una red distinta**. Por ejemplo:

```
[Red A: 192.168.1.0/24] ── E0 [ROUTER] E1 ── [Red B: 192.168.2.0/24]
                              IP E0:           IP E1:
                              192.168.1.1      192.168.2.1
```

El router tiene "un pie" en cada red. Para los PCs de la Red A, el router es su **gateway** (puerta de salida). Para los de la Red B, también, pero por la otra interfaz.

Cuando un PC de la Red A (`192.168.1.50`) quiere hablar con uno de la Red B (`192.168.2.80`):

1. El PC mira la IP destino, ve que **NO está en su red** (`/24` distinto).
2. Decide: "esto no es mío, lo mando a mi gateway, que se encargue".
3. Manda el paquete al router (en capa 2, con la MAC del router).
4. El router recibe el paquete, mira la IP destino, **consulta su tabla de rutas**.
5. La tabla dice: "para llegar a `192.168.2.0/24`, sal por la interfaz E1".
6. El router reenvía el paquete por E1.
7. En la Red B, vuelve a ser un problema de capa 2 → ARP, MAC, entrega al PC destino.

> 💡 **La tabla de rutas es el cerebro del router.** Es literalmente una lista de "para llegar a tal red, ve por tal sitio". Sin tabla de rutas, el router no sabe a dónde mandar nada.

Pregunta clave: **¿cómo se llena esa tabla?** Y aquí es donde aparecen los dos grandes mundos.

---

## 3. ¿Cómo aprende el router las rutas? — Las dos filosofías

Las redes que están **directamente conectadas** al router las aprende solo (porque tú le has puesto IPs en sus interfaces). Hasta ahí gratis.

El problema es cuando el router tiene que llegar a una red que **NO está conectada a él directamente**, sino al otro lado de otro router. Entonces necesita que alguien le diga "para llegar allí, primero pásalo a este otro router".

Hay dos formas de "decirle eso":

### A) Routing estático — "Yo te lo digo a mano"

> Tú, admin, escribes manualmente cada ruta en el router. Le dices: *"para llegar a la red X, pasa el paquete a este otro router que tiene la IP Y"*.

**¿Cuándo tiene sentido?**

- **Redes pequeñas y estables.** 4 routers, no van a cambiar → escribirlo a mano es trivial.
- **Cuando quieres CONTROL ABSOLUTO.** No quieres que un protocolo decida por ti.
- **Por seguridad.** Los routers no se intercambian información de la red entre sí, así que un atacante no puede engañar a tus routers haciéndose pasar por otro router amigo.
- **Para enlaces "stub"** (un único camino de entrada/salida): si solo hay una forma de llegar a una red, no hay nada que "decidir dinámicamente".

**Ventajas:**
- Cero overhead (no consume CPU ni ancho de banda)
- Predecible: el tráfico va siempre por donde tú dijiste
- Más seguro

**Desventajas:**
- Si la red crece, te vuelves loco escribiendo rutas
- Si un enlace falla, el router **no se entera y no se adapta**: sigue mandando paquetes por un camino roto hasta que un humano lo arregle

### B) Routing dinámico — "Que los routers se pongan de acuerdo entre ellos"

> Los routers ejecutan un **protocolo** que les permite **hablar entre sí** y decirse: *"oye, yo conozco esta red, está a 2 saltos de mí"*. Cada router va construyendo su tabla con lo que aprende de los demás.

Eso de "OSPF" y "RIP" que te sonaban a mandanga técnica son simplemente **idiomas distintos** que los routers usan para chismorrear:

| Protocolo | Qué es | Cómo decide el camino |
|-----------|--------|------------------------|
| **RIP** (Routing Information Protocol) | El más antiguo y simple. Cuenta saltos. | "El camino con menos routers en medio gana". Cutre pero funciona. |
| **OSPF** (Open Shortest Path First) | Moderno, estándar abierto, el más usado en empresas. | Mira el "coste" de cada enlace (ancho de banda, etc.) y elige el óptimo. Mucho más listo. |
| **EIGRP** | Propietario de Cisco. Híbrido entre los dos. | Similar a OSPF en sofisticación. |
| **BGP** | El que mueve **Internet entera**. | Decide entre operadoras. Otra liga. |

**¿Cuándo tiene sentido el dinámico?**

- Redes **medianas/grandes** donde mantener rutas estáticas sería un infierno
- Cuando quieres **tolerancia a fallos**: si un enlace cae, los routers se enteran y **recalculan automáticamente** una ruta alternativa
- Cuando la topología puede cambiar

**Ventajas:**
- Se adapta solo
- Escalable
- Si añades una red nueva, los demás routers se enteran solos

**Desventajas:**
- Consume CPU, memoria y ancho de banda (los routers están parloteando entre sí constantemente)
- Más superficie de ataque (un atacante podría inyectar rutas falsas si no está bien configurado)
- Tarda un tiempo en **converger** (ponerse todos de acuerdo) tras un cambio. RIP, por ejemplo, tarda 30 segundos. En ese tiempo hay tráfico que se pierde.

> 🔑 **La elección no es "cuál es mejor"**, es **"cuál encaja con mi red"**. Igual que no eliges entre martillo y destornillador en abstracto.

En la práctica real, las redes grandes usan una **mezcla**: dinámico en el núcleo (donde cambia todo y hay redundancia), estático en los bordes (donde solo hay un camino).

---

## 4. Dentro del routing estático: por destino, por origen, default

Cuando escribes rutas estáticas a mano, hay **tres formas** de hacerlo. No son tres cosas distintas: son **variantes del mismo comando** según qué información le dés al router.

El comando base en Cisco es:
```
ip route <a-dónde> <máscara> <por-dónde>
```

Lo único que cambia es **qué pones en cada hueco**.

### a) Por destino (lo normal, lo que harás el 95% del tiempo)

> "Para llegar a la red X, manda el paquete al router que tiene la IP Y".

```
ip route 192.168.2.0 255.255.255.0 10.0.0.1
                ↑           ↑           ↑
            red destino  máscara   IP del siguiente router
```

**¿Por qué se llama "por destino"?** Porque la decisión la tomas mirando **a dónde va** el paquete. "Si va a esta red → mándalo por aquí".

Aquí necesitas **saber la IP del router vecino** (el "siguiente salto" o *next-hop*). Es lo más preciso y lo más usado.

### b) Por origen / por interfaz de salida

> "Para llegar a la red X, sácala por **mi propia interfaz** E0. No me preguntes a quién se lo doy, simplemente échalo por ahí".

```
ip route 192.168.2.0 255.255.255.0 Ethernet0
                ↑           ↑           ↑
            red destino  máscara   MI interfaz de salida
```

**¿Cuándo se usa?**
- Cuando **NO sabes** la IP del router vecino (por seguridad, o porque no tienes acceso a esa info)
- En enlaces **punto a punto** donde solo hay un router al otro lado, así que da igual su IP — lo que salga por ese cable, llegará a él sí o sí

**Ojo con la confusión del nombre.** En el PDF lo llaman "por origen" pero conceptualmente lo que cambia es que **especificas el interface de salida en vez del next-hop IP**. Es la misma idea: estás definiendo "por dónde sale", solo que en lugar de identificar al vecino por su IP, lo identificas por **tu propio puerto físico**.

> ⚠️ "Por origen" en sentido estricto (decisión basada en quién *envía* el paquete, no a dónde va) se llama **Policy-Based Routing (PBR)** y es algo más avanzado. El PDF mezcla un poco ambas ideas. Tú quédate con esto: si pones IP del vecino → "por destino"; si pones tu interfaz → variante por interfaz de salida; si quieres decidir según QUIÉN envía → eso ya es PBR.

### c) Ruta por defecto (default route, "ruta de último recurso")

> "Cualquier cosa que no sepa enrutar de otra manera, mándala a este router".

```
ip route 0.0.0.0 0.0.0.0 10.0.0.254
            ↑       ↑          ↑
        "todo"   "todo"   gateway de salida
```

`0.0.0.0/0` es una notación que significa **"absolutamente cualquier IP"**. Cuando el router busca en su tabla y no encuentra una ruta específica para el destino, **cae en esta**. Por eso se llama "de último recurso".

**¿Para qué sirve?**

Imagínate tu router de casa. Tiene que saber llegar a Google, a Netflix, a tu banco, a 4.000 millones de IPs distintas. ¿Vas a poner una ruta por cada una? **Imposible**. Lo que haces es:

> "Yo solo conozco mi red local. Para todo lo demás (Internet entera) → mándalo al router del ISP."

Eso es una **default route**. Es la herramienta que hace viable el routing en bordes de red.

### Resumen de los tres en una frase

| Tipo | Lo que dices al router |
|------|-------------------------|
| Por destino | "Para esta red, ve a esta IP vecina" |
| Por interfaz de salida | "Para esta red, échalo por este puerto mío" |
| Default | "Para todo lo que no sepas, mándalo aquí" |

Una **solución mixta** combina los tres: rutas específicas por destino para tráfico interno crítico, alguna por interfaz para enlaces simples, y una default para Internet. Eso da una tabla pequeña pero potente.

---

## 5. ¿Cómo encaja todo esto con lo que ya sabías?

Ahora vuelves al gorrito de admin y te das cuenta de que las piezas son una sola película:

```
┌─────────────────────────────────────────────────────────┐
│  CAPA 2 — dentro de una red                            │
│  Switches, MACs, VLANs, ARP                            │
│  → Mueven tráfico DENTRO de un mismo "barrio"          │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Cuando quieres salir del barrio...
                        ▼
┌─────────────────────────────────────────────────────────┐
│  CAPA 3 — entre redes                                  │
│  Routers, IPs, subredes                                │
│  → Deciden CÓMO se llega de un barrio a otro           │
│                                                         │
│  ┌─────────── Routing ───────────┐                    │
│  │ Estático: tú escribes rutas    │                    │
│  │ Dinámico: routers se chivan    │                    │
│  │   (RIP, OSPF, EIGRP, BGP)      │                    │
│  └────────────────────────────────┘                    │
│                                                         │
│  ┌─────────── NAT/PAT ───────────┐                    │
│  │ Cuando saltas a otra red,      │                    │
│  │ a veces hay que TRADUCIR IPs   │                    │
│  │ (red privada ↔ pública)        │                    │
│  └────────────────────────────────┘                    │
│                                                         │
│  ┌─────────── ACLs ──────────────┐                    │
│  │ Filtran QUÉ tráfico se enruta  │                    │
│  │ y cuál no. Seguridad.          │                    │
│  └────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

**Cada cosa resolvía un problema concreto que la anterior generaba o no cubría:**

- Switches resolvían "que los PCs de mi oficina se hablen"
- VLANs resolvían "que dentro de la oficina haya separación lógica"
- Pero VLANs creaban "ahora no se hablan entre departamentos" → **routing**
- Routing manual no escala → **dinámico** (OSPF, RIP)
- Mi red privada no puede salir a Internet con IPs privadas → **NAT/PAT**
- No quiero que cualquiera pase por mis routers → **ACLs**

Todo es la misma historia: **mover paquetes y controlar el movimiento**.

---

## 6. La pregunta que cierra el círculo

Cuando estés delante del router en Packet Tracer, en lugar de copiar comandos, pregúntate:

1. **¿Quién quiere hablar con quién?** (qué red origen, qué red destino)
2. **¿Están en la misma red?** Si sí, no hace falta routing. Si no, sigue.
3. **¿El router al que le doy la orden conoce las dos redes?** (¿están directamente conectadas a él?)
4. **Si NO conoce alguna, ¿se la enseño a mano (estático) o que la aprenda solo (RIP/OSPF)?**
5. **Si es a mano, ¿le digo la IP del vecino (por destino) o la interfaz mía (por interfaz)?**
6. **¿Hay tráfico genérico que pueda agrupar con una default?**

Si respondes a esas seis preguntas, **estás haciendo routing con criterio, no copiando comandos**. Y eso es lo que separa a un técnico que aprueba de uno que entiende lo que hace.

---

## 7. TL;DR — la versión de bolsillo

- **Routing existe porque las redes están segmentadas** (por VLAN, por subred, por geografía...) y alguien tiene que cruzar entre ellas.
- **El router es el aparato** que conecta dos o más redes y tiene una **tabla de rutas** que le dice por dónde mandar cada cosa.
- La tabla se llena de **3 maneras**: rutas conectadas (gratis), estáticas (a mano), dinámicas (RIP/OSPF/etc., aprenden solas).
- **Estático = control y pequeñas redes. Dinámico = adaptable y redes grandes.** Casi siempre se combinan.
- En estático tienes 3 sabores: **por destino** (next-hop IP), **por interfaz** (mi puerto de salida), **default** (todo lo demás).
- Routing no vive solo: convive con **VLANs, NAT, ACLs**. Cada uno resuelve un trozo del puzzle.

