# Unidad 6 — Seguridad en Administración de Redes

Resumen basado en los documentos de la Unidad 6: contenido teórico y presentación ampliada sobre amenazas, ataques y Port-Security.

---

## 1. Qué tienes que estudiar sí o sí

### Objetivo de la unidad

La unidad trata sobre **seguridad en redes**, especialmente:

- Tipos de ataques a una organización.
- Ataques basados en software.
- Ataques o riesgos en la red local.
- Medidas de detección y contención.
- Uso de **Port-Security** en switches Cisco.

No hace falta memorizar toda la teoría larga, pero sí entender **qué amenaza es cada una**, **cómo actúa** y **qué medida se aplica para reducir el riesgo**.

---

## 2. Amenazas basadas en software

Las amenazas software suelen llamarse de forma genérica “virus”, pero realmente forman parte del concepto más amplio de **malware**.

### Keylogger

Un **keylogger** registra las teclas que pulsa el usuario.

**Lo importante:**

- Sirve para robar credenciales.
- Puede capturar usuarios, contraseñas, datos bancarios, etc.
- Puede enviar la información al atacante mediante FTP u otros sistemas.
- También existen keyloggers físicos, conectados por USB.

**Estudiar:** definición y finalidad: *captura de pulsaciones para robar credenciales*.

---

### Troyano

Un **troyano** es malware que busca dar al atacante **control remoto** sobre una máquina.

**Lo importante:**

- Se presenta como si fuera software legítimo.
- Busca engañar al usuario.
- Suele funcionar mediante **shell inversa**.
- La víctima inicia una conexión hacia el atacante, lo que puede esquivar filtros de firewall de entrada.

**Estudiar:** control remoto + engaño + shell inversa.

---

### Ransomware

El **ransomware** secuestra la información de una organización cifrando sus archivos.

**Funcionamiento básico:**

1. Infecta el sistema.
2. Cifra los ficheros.
3. El atacante exige dinero por la clave de descifrado.
4. La organización puede quedar bloqueada.

**Estudiar:** cifrado malicioso + rescate económico + paralización de la organización.

---

### Exploit

Un **exploit** es un fragmento de código que aprovecha una vulnerabilidad concreta de un sistema operativo o aplicación.

**Idea clave:**

- El exploit es el código que explota el fallo.
- El **payload** es lo que ocurre después: robo de datos, instalación de malware, backdoor, etc.

### Exploit Zero Day

Un **Zero Day** explota una vulnerabilidad que todavía no ha sido descubierta o parcheada por el fabricante.

**Estudiar:** vulnerabilidad no parcheada + muy peligroso porque todavía no hay defensa oficial.

---

## 3. Anatomía básica de un ataque de malware

Un ataque suele seguir una cadena bastante lógica:

1. **Vector de entrada:** phishing, USB, web maliciosa.
2. **Instalación:** el malware entra en el sistema.
3. **Comunicación:** puede contactar con el servidor del atacante.
4. **Ejecución del payload:** robo, cifrado, control remoto, etc.
5. **Impacto:** pérdida de datos, extorsión o bloqueo del sistema.

**Estudiar:** no hace falta memorizarlo palabra por palabra, pero sí entender que un ataque tiene fases y que se puede detener si se corta una de ellas.

---

## 4. Port-Security

### Qué es

**Port-Security** es una función de los switches Cisco que limita qué dispositivos pueden usar un puerto del switch en función de su **dirección MAC**.

Sirve para proteger la red local frente a accesos no autorizados.

**Idea principal:**  
un puerto solo debe aceptar las MAC permitidas. Si aparece otra MAC, se considera una violación de seguridad.

---

## 5. Por qué proteger Capa 2

Los switches trabajan en **Capa 2** y son un punto débil si cualquiera puede conectar un dispositivo físico a la red.

**Medidas básicas:**

- Desactivar puertos no usados.
- Configurar Port-Security en puertos activos.
- Limitar el número de MAC permitidas por puerto.

**Estudiar:** Capa 2 = acceso físico a la red; Port-Security controla quién puede conectarse.

---

## 6. Configuración básica de Port-Security

Comandos importantes:

```bash
S1(config)# interface fa0/1
S1(config-if)# switchport mode access
S1(config-if)# switchport port-security
S1(config-if)# switchport port-security maximum 4
S1(config-if)# switchport port-security mac-address aaaa.bbbb.1234
S1(config-if)# switchport port-security mac-address sticky
```

### Qué hace cada comando

```bash
switchport mode access
```

Pone el puerto en modo acceso. Es necesario porque Port-Security se aplica en puertos de acceso o trunks configurados manualmente.

```bash
switchport port-security
```

Activa Port-Security.

```bash
switchport port-security maximum 4
```

Permite hasta 4 direcciones MAC en ese puerto.

```bash
switchport port-security mac-address aaaa.bbbb.1234
```

Configura manualmente una MAC permitida.

```bash
switchport port-security mac-address sticky
```

Permite que el switch aprenda MACs automáticamente y las deje pegadas en la configuración en ejecución.

**Estudiar:** saber interpretar estos comandos, especialmente `maximum`, `mac-address` y `sticky`.

---

## 7. Formas de aprender direcciones MAC

### 1. Manual

El administrador escribe la MAC permitida.

```bash
switchport port-security mac-address aaaa.bbbb.1234
```

### 2. Dinámica

El switch aprende la MAC conectada, pero no queda guardada tras reinicio.

### 3. Sticky

El switch aprende la MAC automáticamente y la añade a la configuración en ejecución.

```bash
switchport port-security mac-address sticky
```

**Estudiar especialmente:** diferencia entre dinámica y sticky.

---

## 8. Modos de violación

Cuando aparece una MAC no autorizada, el switch puede reaccionar de tres formas:

| Modo | Qué hace | Notifica |
|---|---|---|
| `shutdown` | Apaga el puerto y lo deja en error-disabled | Sí |
| `restrict` | Descarta tráfico de MAC no autorizada | Sí |
| `protect` | Descarta tráfico de MAC no autorizada | No |

### Shutdown

Es el modo por defecto y el más restrictivo.

El puerto queda deshabilitado y hay que reactivarlo con:

```bash
shutdown
no shutdown
```

### Restrict

No apaga el puerto. Solo bloquea la MAC no autorizada y genera aviso.

### Protect

Bloquea la MAC no autorizada, pero no avisa. Es el menos visible.

**Estudiar mucho:** esta tabla suele ser carne de examen.

---

## 9. Comandos de verificación

```bash
show port-security
```

Muestra un resumen general de Port-Security.

```bash
show port-security interface fa0/5
```

Muestra el detalle de un puerto concreto.

```bash
show port-security address
```

Muestra las MAC seguras configuradas o aprendidas.

**Estudiar:** saber para qué sirve cada comando.

---

## 10. Qué NO estudiaría demasiado

No perdería mucho tiempo en:

- Los textos largos de introducción.
- Las explicaciones repetidas entre ambos documentos.
- La bibliografía.
- Los ejemplos muy largos de salida completa del switch, salvo saber interpretarlos por encima.
- Datos concretos como “hasta 8192 MACs”, salvo que el profesor pregunte detalles muy concretos.

---

## 11. Lo que sí debes llevar claro para examen

Estudia especialmente esto:

1. Diferencia entre **keylogger, troyano, ransomware y exploit**.
2. Qué es un **Zero Day**.
3. Diferencia entre **exploit** y **payload**.
4. Qué es **Port-Security**.
5. Por qué se aplica en **Capa 2**.
6. Cómo limitar MACs por puerto.
7. Diferencia entre MAC **manual**, **dinámica** y **sticky**.
8. Modos de violación: `shutdown`, `restrict`, `protect`.
9. Comandos básicos de configuración.
10. Comandos de verificación.

---

## 12. Resumen ultracorto

La unidad explica amenazas de seguridad y cómo proteger la red local.

En software, debes conocer:

- Keyloggers.
- Troyanos.
- Ransomware.
- Exploits.

En red, lo más importante es **Port-Security**: controlar qué MACs pueden usar cada puerto del switch.

Lo más preguntable son:

- Los modos de violación.
- La diferencia entre aprendizaje manual, dinámico y sticky.
- Los comandos Cisco básicos.
