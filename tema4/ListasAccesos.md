# Tema 4 — ACLs: Resumen en 30 líneas

1. Una ACL (Access Control List) es una lista secuencial de reglas `permit`/`deny` que filtra paquetes.
2. Cada regla individual de la lista se llama ACE (Access Control Entry).
3. Sirven para filtrar tráfico entre redes/VLANs, proteger gestión (SSH), controlar servicios, QoS, NAT y routing.
4. Una ACL traduce una política de seguridad en reglas técnicas aplicadas en routers o switches de capa 3.
5. Crear la ACL no basta: no filtra nada hasta aplicarla a una interfaz con `ip access-group número in|out`.
6. El sentido se mira siempre desde el router: `in` = el paquete entra al router, `out` = sale de él.
7. `in` se evalúa antes de enrutar (más eficiente: descarta pronto); `out` después de enrutar (gasta más recursos).
8. Las ACLs se procesan de arriba abajo: la primera coincidencia gana y el resto ya no se evalúa.
9. Por eso una regla general colocada antes anula las reglas específicas que vengan después.
10. Buena práctica: reglas específicas (hosts, puertos) primero; reglas generales al final.
11. Toda ACL termina con un `deny ip any any` implícito e invisible.
12. Consecuencia: todo lo no permitido explícitamente queda bloqueado; una ACL sin ningún `permit` bloquea todo.
13. Si solo quieres bloquear algo concreto, necesitas un `permit ip any any` al final.
14. Las wildcard (máscaras inversas) dicen qué bits deben coincidir: 0 = debe coincidir, 1 = da igual.
15. Se calculan restando la máscara normal a 255.255.255.255: /24 → 0.0.0.255, /28 → 0.0.0.15, /16 → 0.0.255.255.
16. `host 10.1.1.2` equivale a `10.1.1.2 0.0.0.0` (una IP exacta).
17. `any` equivale a `0.0.0.0 255.255.255.255` (cualquier IP).
18. ACL estándar: filtra SOLO por IP de origen; rangos 1–99 y 1300–1999.
19. Como es poco precisa, la estándar se coloca cerca del destino.
20. ACL extendida: filtra por origen, destino, protocolo y puerto; rangos 100–199 y 2000–2699.
21. Como es precisa, la extendida se coloca cerca del origen (mata el tráfico cuanto antes).
22. Sintaxis extendida: `access-list 101 permit ip ORIGEN WILDCARD DESTINO WILDCARD [eq puerto]`.
23. `permit ip` permite todo (TCP, UDP, ICMP...); `permit tcp` SOLO TCP (ni ping ni DHCP); `permit udp` solo UDP.
24. Ejemplo clave: `deny tcp host X any eq 22` + `permit ip any any` = bloquea SSH de ese host, permite el resto.
25. Trampa DHCP: usa UDP 67/68 con origen 0.0.0.0 y destino 255.255.255.255; si la ACL no lo permite, el PC no obtiene IP.
26. ICMP: `echo` = solicitud de ping, `echo-reply` = respuesta; se pueden filtrar por separado.
27. ACLs nombradas (`ip access-list extended NOMBRE`): más legibles y editables, con números de secuencia.
28. Los números de secuencia (10, 20, 30...) permiten insertar reglas intermedias (ej. la 15 entre 10 y 20) sin recrear la ACL.
29. Verificación obligatoria tras cada cambio: `show access-list` (orden, reglas y contadores de coincidencias).
30. Errores típicos: no aplicar la ACL, olvidar el deny implícito, usar `tcp` creyendo que es todo, romper DHCP y poner lo general antes que lo específico.
