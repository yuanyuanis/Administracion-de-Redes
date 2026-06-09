# Unidad 6 — Test de estudio: Seguridad en Administración de Redes

**Instrucciones:**  
Cada pregunta puede tener **una o varias respuestas correctas**.  
Lee bien los matices: muchas opciones están pensadas para confundirte entre conceptos parecidos.

---

# Preguntas

## 1. Protección básica de Capa 2

¿Cuáles de las siguientes son medidas básicas para proteger un switch en Capa 2?

A. Inhabilitar los puertos que no se utilizan.  
B. Habilitar Port-Security en los puertos activos.  
C. Limitar las direcciones MAC permitidas por puerto.  
D. Permitir cualquier dirección MAC para facilitar la conexión de nuevos equipos.  

---

## 2. Dispositivos de Capa 2 y objetivo de protección

¿Cuáles de las siguientes afirmaciones son correctas?

A. Los switches trabajan principalmente en Capa 2.  
B. La Capa 2 puede ser un punto débil si cualquiera puede conectar físicamente un dispositivo a la red.  
C. Port-Security sirve para controlar qué dispositivos pueden usar un puerto del switch según su dirección MAC.  
D. Port-Security cifra todo el tráfico que pasa por el switch.  

---

## 3. Port-Security: afirmaciones generales

¿Cuáles de las siguientes afirmaciones son correctas sobre Port-Security?

A. Limita el número de direcciones MAC válidas en un puerto.  
B. Puede configurarse con direcciones MAC manuales.  
C. Puede aprender direcciones MAC dinámicamente.  
D. Solo funciona en routers de capa 3 y no en switches.  

---

## 4. Anatomía de un ataque de malware

¿Cuál es el orden más correcto de la anatomía básica de un ataque de malware?

A. Impacto → vector de entrada → instalación → comunicación → ejecución del payload.  
B. Vector de entrada → instalación → comunicación → ejecución del payload → impacto.  
C. Comunicación → instalación → vector de entrada → impacto → payload.  
D. Instalación → impacto → vector de entrada → comunicación → payload.  

---

## 5. Payload e impacto

¿Cuáles de las siguientes afirmaciones son correctas?

A. El payload es la acción o consecuencia que se ejecuta tras explotar una vulnerabilidad.  
B. El payload puede consistir en robo de datos, instalación de malware o creación de una backdoor.  
C. El impacto es el efecto final sobre la organización, como pérdida de datos, extorsión o bloqueo.  
D. El impacto siempre ocurre antes del vector de entrada.  

---

## 6. Keylogger

¿Cuáles de las siguientes afirmaciones son correctas sobre un keylogger?

A. Registra las pulsaciones de teclado del usuario.  
B. Puede usarse para robar credenciales.  
C. Puede capturar usuarios, contraseñas o datos bancarios.  
D. Su función principal es cifrar todos los archivos de una organización y pedir un rescate.  

---

## 7. Keyloggers físicos

¿Cuáles de las siguientes afirmaciones son correctas?

A. Existen keyloggers hardware que pueden conectarse físicamente al equipo.  
B. Algunos keyloggers físicos pueden funcionar sin modificar el software del sistema.  
C. Para usar un keylogger hardware normalmente se necesita acceso físico a la máquina.  
D. Un keylogger físico es lo mismo que un exploit Zero Day.  

---

## 8. Troyano

¿Cuáles de las siguientes afirmaciones son correctas sobre un troyano?

A. Busca obtener control remoto de la máquina infectada.  
B. Suele presentarse como si fuera software legítimo.  
C. Puede funcionar mediante una shell inversa.  
D. Su objetivo principal es aprender direcciones MAC en un switch.  

---

## 9. Troyano y shell inversa

¿Cuál de las siguientes opciones describe mejor una shell inversa?

A. El atacante se conecta directamente a la víctima mediante una conexión entrante tradicional.  
B. La víctima establece una conexión saliente hacia el servidor del atacante.  
C. El switch aprende dinámicamente la dirección MAC del atacante.  
D. Es un sistema para cifrar ficheros y pedir un rescate.  

---

## 10. Ransomware

¿Cuáles de las siguientes afirmaciones son correctas sobre el ransomware?

A. Cifra los ficheros de la víctima.  
B. Exige un rescate económico a cambio de la clave de descifrado.  
C. Puede paralizar una organización al impedir el acceso a sus datos.  
D. Su función principal es registrar las teclas pulsadas por el usuario.  

---

## 11. Exploit

¿Cuáles de las siguientes definiciones son correctas?

A. Un exploit es un segmento de código diseñado para aprovechar una vulnerabilidad concreta.  
B. Un exploit puede atacar fallos de sistemas operativos o aplicaciones.  
C. El exploit es lo mismo que Port-Security.  
D. El payload es el resultado o acción que se produce al explotar la vulnerabilidad.  

---

## 12. Zero Day

¿Cuáles de las siguientes afirmaciones son correctas sobre un exploit Zero Day?

A. Aprovecha una vulnerabilidad aún no parcheada por el fabricante.  
B. Es especialmente peligroso porque todavía no existe una corrección oficial disponible.  
C. Solo afecta a equipos que tengan mal configurado Port-Security.  
D. Puede afectar a cualquier sistema que use el software vulnerable.  

---

## 13. Diferenciar malware

Relaciona mentalmente cada definición con el tipo de malware. ¿Cuáles son correctas?

A. Keylogger: captura pulsaciones de teclado.  
B. Troyano: busca control remoto encubierto.  
C. Ransomware: cifra datos y exige rescate.  
D. Exploit: limita las MAC permitidas por puerto.  

---

## 14. Métodos de aprendizaje MAC en Port-Security

¿Cuáles de las siguientes afirmaciones son correctas?

A. En el método manual, el administrador configura explícitamente la dirección MAC permitida.  
B. En el método dinámico, el switch aprende la MAC, pero puede perderse tras reinicio si no se guarda en la configuración.  
C. En el método sticky, el switch aprende la MAC y la añade a la running-config.  
D. En el método sticky, el switch descarta todas las MAC sin generar avisos.  

---

## 15. Diferencia entre dinámico y sticky

¿Cuál de las siguientes afirmaciones distingue mejor el aprendizaje dinámico del sticky?

A. El dinámico aprende MACs, pero no las conserva necesariamente tras reiniciar; sticky las pega a la configuración en ejecución.  
B. Sticky significa que el puerto se apaga automáticamente ante cualquier MAC válida.  
C. El aprendizaje dinámico solo existe en routers, no en switches.  
D. El aprendizaje sticky sirve para cifrar las MAC aprendidas.  

---

## 16. Modos de violación

¿Cuáles de las siguientes asociaciones son correctas?

A. `shutdown`: el puerto pasa a error-disabled.  
B. `restrict`: descarta tráfico de MAC no autorizada y genera notificación.  
C. `protect`: descarta tráfico de MAC no autorizada sin generar notificación.  
D. `shutdown`: permite todo el tráfico sin registrar eventos.  

---

## 17. Modo más restrictivo

¿Cuál es el modo de violación por defecto y más restrictivo en Port-Security?

A. `restrict`  
B. `protect`  
C. `shutdown`  
D. `sticky`  

---

## 18. Reacción ante violación en modo shutdown

¿Qué ocurre normalmente cuando una MAC no autorizada provoca una violación en modo `shutdown`?

A. El puerto entra en estado error-disabled.  
B. El puerto puede requerir intervención manual para reactivarse.  
C. Puede ser necesario usar `shutdown` y después `no shutdown` para recuperarlo.  
D. El puerto sigue funcionando normalmente y no se registra nada.  

---

## 19. Comandos básicos de configuración

¿Cuáles de los siguientes comandos forman parte de una configuración básica de Port-Security?

A. `switchport mode access`  
B. `switchport port-security`  
C. `switchport port-security maximum 3`  
D. `router rip port-security enable`  

---

## 20. Comandos de verificación

¿Cuáles de los siguientes comandos de verificación son correctos?

A. `show port-security`  
B. `show port-security interface fa0/5`  
C. `show port-security address`  
D. `show ransomware interface fa0/5`  

---

# Respuestas razonadas

## 1. Respuesta correcta: A, B y C

- **A correcta:** desactivar puertos no usados es una medida básica de hardening.
- **B correcta:** Port-Security ayuda a controlar qué dispositivos pueden conectarse.
- **C correcta:** limitar MACs por puerto es justo la idea central de Port-Security.
- **D incorrecta:** permitir cualquier MAC elimina el control de acceso.

---

## 2. Respuesta correcta: A, B y C

- **A correcta:** los switches trabajan principalmente en Capa 2.
- **B correcta:** si alguien puede conectar físicamente un equipo, puede intentar acceder a la red.
- **C correcta:** Port-Security controla el acceso por dirección MAC.
- **D incorrecta:** Port-Security no cifra el tráfico; limita MACs permitidas.

---

## 3. Respuesta correcta: A, B y C

- **A correcta:** Port-Security limita MACs válidas por puerto.
- **B correcta:** se pueden configurar MACs manualmente.
- **C correcta:** también puede aprender MACs de forma dinámica.
- **D incorrecta:** se usa precisamente en switches, especialmente en puertos de acceso.

---

## 4. Respuesta correcta: B

- **A incorrecta:** el impacto no ocurre al principio.
- **B correcta:** primero entra el malware, luego se instala, se comunica, ejecuta el payload y finalmente produce impacto.
- **C incorrecta:** la comunicación no suele ser el primer paso.
- **D incorrecta:** mezcla fases en orden ilógico.

---

## 5. Respuesta correcta: A, B y C

- **A correcta:** el payload es lo que se ejecuta o se consigue al explotar algo.
- **B correcta:** puede ser robo, instalación de malware, backdoor, etc.
- **C correcta:** el impacto es el daño final para la organización.
- **D incorrecta:** el impacto va al final, no antes del vector de entrada.

---

## 6. Respuesta correcta: A, B y C

- **A correcta:** un keylogger registra pulsaciones.
- **B correcta:** se usa para robar credenciales.
- **C correcta:** puede capturar usuarios, contraseñas y datos sensibles.
- **D incorrecta:** eso describe ransomware, no keylogger.

---

## 7. Respuesta correcta: A, B y C

- **A correcta:** existen keyloggers físicos.
- **B correcta:** pueden funcionar sin instalar software.
- **C correcta:** normalmente requieren acceso físico.
- **D incorrecta:** un Zero Day es un exploit contra una vulnerabilidad no parcheada, no un dispositivo físico de captura de teclado.

---

## 8. Respuesta correcta: A, B y C

- **A correcta:** el objetivo típico del troyano es el control remoto.
- **B correcta:** se disfraza de software legítimo para engañar.
- **C correcta:** puede usar shell inversa.
- **D incorrecta:** aprender MACs es propio de un switch con Port-Security, no de un troyano.

---

## 9. Respuesta correcta: B

- **A incorrecta:** eso sería una conexión directa entrante hacia la víctima.
- **B correcta:** en una shell inversa, la víctima inicia una conexión saliente hacia el atacante.
- **C incorrecta:** eso pertenece al aprendizaje MAC.
- **D incorrecta:** eso describe ransomware.

---

## 10. Respuesta correcta: A, B y C

- **A correcta:** el ransomware cifra archivos.
- **B correcta:** exige rescate a cambio de la clave.
- **C correcta:** puede bloquear completamente la actividad de una organización.
- **D incorrecta:** registrar teclas corresponde a keylogger.

---

## 11. Respuesta correcta: A, B y D

- **A correcta:** el exploit es código que aprovecha una vulnerabilidad.
- **B correcta:** puede afectar a sistemas operativos o aplicaciones.
- **C incorrecta:** Port-Security es una medida de seguridad en switches, no un exploit.
- **D correcta:** el payload es la consecuencia o acción tras explotar la vulnerabilidad.

---

## 12. Respuesta correcta: A, B y D

- **A correcta:** un Zero Day usa una vulnerabilidad no parcheada.
- **B correcta:** es peligroso porque todavía no hay solución oficial.
- **C incorrecta:** no tiene que ver con Port-Security.
- **D correcta:** afecta a sistemas con el software vulnerable.

---

## 13. Respuesta correcta: A, B y C

- **A correcta:** keylogger = captura teclas.
- **B correcta:** troyano = control remoto encubierto.
- **C correcta:** ransomware = cifrado + rescate.
- **D incorrecta:** limitar MACs por puerto corresponde a Port-Security, no a un exploit.

---

## 14. Respuesta correcta: A, B y C

- **A correcta:** manual significa que el administrador escribe la MAC.
- **B correcta:** dinámico aprende la MAC, pero no queda necesariamente guardada para siempre.
- **C correcta:** sticky aprende y pega la MAC en la running-config.
- **D incorrecta:** eso se parece al modo `protect`, no al método sticky.

---

## 15. Respuesta correcta: A

- **A correcta:** es la diferencia esencial entre dinámico y sticky.
- **B incorrecta:** sticky no significa apagar el puerto.
- **C incorrecta:** el aprendizaje dinámico se usa en switches.
- **D incorrecta:** sticky no cifra MACs.

---

## 16. Respuesta correcta: A, B y C

- **A correcta:** `shutdown` deja el puerto en error-disabled.
- **B correcta:** `restrict` descarta tráfico no autorizado y notifica.
- **C correcta:** `protect` descarta, pero no notifica.
- **D incorrecta:** `shutdown` es el modo más restrictivo, no permisivo.

---

## 17. Respuesta correcta: C

- **A incorrecta:** `restrict` bloquea tráfico no autorizado y notifica, pero no es el modo por defecto más restrictivo.
- **B incorrecta:** `protect` es menos visible porque no notifica.
- **C correcta:** `shutdown` es el modo por defecto y el más restrictivo.
- **D incorrecta:** `sticky` no es un modo de violación; es un método de aprendizaje MAC.

---

## 18. Respuesta correcta: A, B y C

- **A correcta:** en modo `shutdown`, el puerto entra en error-disabled.
- **B correcta:** normalmente requiere intervención del administrador.
- **C correcta:** se puede recuperar con `shutdown` y `no shutdown`.
- **D incorrecta:** eso se parece más a no tener seguridad o a un modo sin notificación, no a `shutdown`.

---

## 19. Respuesta correcta: A, B y C

- **A correcta:** se fuerza el puerto a modo acceso.
- **B correcta:** activa Port-Security.
- **C correcta:** define el máximo de MACs permitidas.
- **D incorrecta:** ese comando no corresponde a la configuración Cisco vista en la unidad.

---

## 20. Respuesta correcta: A, B y C

- **A correcta:** muestra resumen de Port-Security.
- **B correcta:** muestra detalle de un puerto concreto.
- **C correcta:** muestra la tabla de MACs seguras.
- **D incorrecta:** ese comando no existe en este contexto; mezcla ransomware con comandos de switch.

---

# Repaso final rápido

Lo más importante para examen:

- **Keylogger:** captura teclas y credenciales.
- **Troyano:** control remoto, engaño, shell inversa.
- **Ransomware:** cifra datos y pide rescate.
- **Exploit:** código que aprovecha una vulnerabilidad.
- **Zero Day:** vulnerabilidad no parcheada.
- **Payload:** acción tras explotar la vulnerabilidad.
- **Port-Security:** limita MACs por puerto.
- **Manual:** MAC escrita por el administrador.
- **Dinámico:** el switch aprende la MAC, pero no queda necesariamente persistente.
- **Sticky:** aprende y pega la MAC a la running-config.
- **Shutdown:** modo por defecto y más restrictivo.
- **Restrict:** bloquea y notifica.
- **Protect:** bloquea sin notificar.
- **Verificación:** `show port-security`, `show port-security interface`, `show port-security address`.
