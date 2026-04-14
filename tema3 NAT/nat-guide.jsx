import { useState } from "react";

const TABS = ["¿Qué es NAT?", "NAT Estático", "NAT Dinámico", "NAT/PAT (Puertos)"];

const palette = {
  bg: "#0a0e17",
  card: "#111827",
  cardAlt: "#1a2236",
  accent: "#22d3ee",
  accent2: "#a78bfa",
  accent3: "#f472b6",
  warn: "#fbbf24",
  green: "#34d399",
  text: "#e2e8f0",
  muted: "#64748b",
  border: "#1e293b",
};

const font = `'JetBrains Mono', 'Fira Code', 'SF Mono', monospace`;

const Box = ({ children, style, glow }) => (
  <div
    style={{
      background: palette.card,
      border: `1px solid ${palette.border}`,
      borderRadius: 12,
      padding: "18px 20px",
      boxShadow: glow ? `0 0 24px ${glow}33` : "none",
      ...style,
    }}
  >
    {children}
  </div>
);

const Tag = ({ color, children }) => (
  <span
    style={{
      background: `${color}22`,
      color,
      borderRadius: 6,
      padding: "2px 10px",
      fontSize: 13,
      fontWeight: 600,
      border: `1px solid ${color}44`,
      fontFamily: font,
    }}
  >
    {children}
  </span>
);

const Arrow = ({ color = palette.accent, label, reverse }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      minWidth: 70,
    }}
  >
    {label && (
      <span style={{ fontSize: 11, color: palette.muted, fontFamily: font }}>
        {label}
      </span>
    )}
    <svg width="70" height="22" viewBox="0 0 70 22">
      {reverse ? (
        <>
          <line x1="60" y1="11" x2="10" y2="11" stroke={color} strokeWidth="2" />
          <polygon points="10,11 18,6 18,16" fill={color} />
        </>
      ) : (
        <>
          <line x1="10" y1="11" x2="60" y2="11" stroke={color} strokeWidth="2" />
          <polygon points="60,11 52,6 52,16" fill={color} />
        </>
      )}
    </svg>
  </div>
);

const Device = ({ ip, label, color = palette.accent, icon }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        background: `${color}15`,
        border: `2px solid ${color}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
      }}
    >
      {icon}
    </div>
    <span
      style={{ fontSize: 12, color: palette.muted, fontFamily: font }}
    >
      {label}
    </span>
    <Tag color={color}>{ip}</Tag>
  </div>
);

const Router = ({ label = "Router NAT", color = palette.warn }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}
  >
    <div
      style={{
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: `${color}18`,
        border: `2px solid ${color}66`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
      }}
    >
      🔀
    </div>
    <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: font }}>
      {label}
    </span>
  </div>
);

const NATTable = ({ rows, columns }) => (
  <div style={{ overflowX: "auto" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: font,
        fontSize: 13,
      }}
    >
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th
              key={i}
              style={{
                textAlign: "left",
                padding: "8px 12px",
                borderBottom: `2px solid ${palette.accent}44`,
                color: palette.accent,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "7px 12px",
                  borderBottom: `1px solid ${palette.border}`,
                  color: palette.text,
                  whiteSpace: "nowrap",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CodeBlock = ({ children }) => (
  <pre
    style={{
      background: "#0d1117",
      border: `1px solid ${palette.border}`,
      borderRadius: 8,
      padding: "14px 16px",
      fontFamily: font,
      fontSize: 13,
      color: palette.green,
      overflowX: "auto",
      lineHeight: 1.6,
      margin: "10px 0",
    }}
  >
    {children}
  </pre>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <h3
      style={{
        color: palette.accent,
        fontFamily: font,
        fontSize: 16,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: palette.accent,
          display: "inline-block",
        }}
      />
      {title}
    </h3>
    {children}
  </div>
);

// ─── TABS ───────────────────────────────────────

function TabIntro() {
  return (
    <div>
      <Section title="El problema que resuelve NAT">
        <p style={{ color: palette.text, lineHeight: 1.75, fontSize: 14 }}>
          IPv4 tiene <Tag color={palette.warn}>~4.300 millones</Tag> de direcciones.
          Hay más de 15.000 millones de dispositivos conectados. NAT es el "hack" que permite
          que millones de dispositivos compartan unas pocas IPs públicas.
        </p>
        <Box style={{ marginTop: 16 }} glow={palette.accent}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
            <Device ip="192.168.1.10" label="Tu PC" color={palette.accent} icon="💻" />
            <Device ip="192.168.1.11" label="Móvil" color={palette.accent2} icon="📱" />
            <Device ip="192.168.1.12" label="Tablet" color={palette.accent3} icon="📟" />
            <Arrow label="LAN" />
            <Router />
            <Arrow label="WAN" />
            <Device ip="85.60.42.7" label="Internet" color={palette.green} icon="🌍" />
          </div>
          <p style={{ color: palette.muted, fontSize: 12, textAlign: "center", marginTop: 14, fontFamily: font }}>
            3 dispositivos privados → 1 sola IP pública (85.60.42.7)
          </p>
        </Box>
      </Section>

      <Section title="Analogía para programadores">
        <Box style={{ background: palette.cardAlt }}>
          <p style={{ color: palette.text, lineHeight: 1.75, fontSize: 14 }}>
            Piensa en NAT como un <strong style={{ color: palette.accent }}>reverse proxy</strong> pero a nivel de red.
            Igual que Nginx recibe peticiones en el puerto 80 y las redirige a distintos servicios internos,
            el router NAT recibe paquetes en su IP pública y los redirige a distintas IPs privadas de tu LAN.
          </p>
          <CodeBlock>{`// Conceptualmente, NAT hace esto:
// Paquete SALE de tu PC:
src: 192.168.1.10:54321 → dst: 93.184.216.34:443

// El router TRADUCE:
src: 85.60.42.7:54321  → dst: 93.184.216.34:443
//    ↑ reemplaza IP privada por IP pública

// Cuando llega la RESPUESTA:
src: 93.184.216.34:443  → dst: 85.60.42.7:54321

// El router DESHACE la traducción:
src: 93.184.216.34:443  → dst: 192.168.1.10:54321
//                              ↑ de vuelta a tu PC`}</CodeBlock>
        </Box>
      </Section>

      <Section title="Rangos de IPs privadas (RFC 1918)">
        <NATTable
          columns={["Rango", "CIDR", "Nº direcciones", "Uso típico"]}
          rows={[
            ["10.0.0.0 – 10.255.255.255", "10.0.0.0/8", "16.7M", "Empresas grandes"],
            ["172.16.0.0 – 172.31.255.255", "172.16.0.0/12", "1M", "Oficinas medianas"],
            ["192.168.0.0 – 192.168.255.255", "192.168.0.0/16", "65K", "Casas / labs"],
          ]}
        />
        <p style={{ color: palette.muted, fontSize: 12, marginTop: 10, fontFamily: font }}>
          Estas IPs NUNCA se enrutan en Internet. Por eso necesitas NAT para salir.
        </p>
      </Section>

      <Section title="Los 3 tipos de NAT">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { name: "Estático", desc: "1 privada ↔ 1 pública (fija)", color: palette.accent },
            { name: "Dinámico", desc: "N privadas ↔ Pool de públicas", color: palette.accent2 },
            { name: "PAT / Overload", desc: "N privadas ↔ 1 pública + puertos", color: palette.accent3 },
          ].map((t) => (
            <Box
              key={t.name}
              glow={t.color}
              style={{ flex: "1 1 160px", minWidth: 160 }}
            >
              <div style={{ fontWeight: 700, color: t.color, fontFamily: font, fontSize: 15 }}>
                {t.name}
              </div>
              <div style={{ color: palette.muted, fontSize: 13, marginTop: 6 }}>
                {t.desc}
              </div>
            </Box>
          ))}
        </div>
      </Section>
    </div>
  );
}

function TabStatic() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Mapeo fijo configurado", desc: "El admin define: 192.168.1.100 ↔ 85.60.42.10 (siempre)" },
    { label: "Servidor web envía paquete", desc: "src: 192.168.1.100:80 → dst: cliente externo" },
    { label: "Router traduce", desc: "src: 85.60.42.10:80 → dst: cliente externo" },
    { label: "Respuesta vuelve", desc: "dst: 85.60.42.10:80 → router → dst: 192.168.1.100:80" },
  ];

  return (
    <div>
      <Section title="¿Qué es NAT Estático?">
        <p style={{ color: palette.text, lineHeight: 1.75, fontSize: 14 }}>
          Es un mapeo <strong style={{ color: palette.accent }}>1:1 permanente</strong> entre
          una IP privada y una IP pública. Siempre la misma IP privada se traduce a la misma IP pública.
          Es como un <Tag color={palette.accent}>DNS A record</Tag> pero a nivel IP.
        </p>
      </Section>

      <Section title="¿Cuándo se usa?">
        <Box style={{ background: palette.cardAlt }}>
          <ul style={{ color: palette.text, lineHeight: 2, fontSize: 14, paddingLeft: 20, margin: 0 }}>
            <li>Servidores web/mail internos que necesitan ser accesibles desde Internet</li>
            <li>Servicios que requieren una IP fija (certificados SSL, whitelisting)</li>
            <li>Cámaras IP / sistemas SCADA accesibles remotamente</li>
          </ul>
        </Box>
      </Section>

      <Section title="Simulación paso a paso">
        <Box glow={palette.accent}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                style={{
                  background: step === i ? palette.accent : palette.cardAlt,
                  color: step === i ? palette.bg : palette.muted,
                  border: `1px solid ${step === i ? palette.accent : palette.border}`,
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontFamily: font,
                  fontSize: 12,
                  fontWeight: step === i ? 700 : 400,
                  transition: "all .2s",
                }}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 14,
              padding: "12px 0",
            }}
          >
            <Device
              ip="192.168.1.100"
              label="Servidor Web"
              color={step >= 1 ? palette.accent : palette.muted}
              icon="🖥️"
            />
            {step >= 1 && <Arrow color={palette.accent} />}
            <Router label="NAT Estático" color={palette.warn} />
            {step >= 2 && <Arrow color={palette.green} />}
            <Device
              ip="85.60.42.10"
              label="IP Pública Fija"
              color={step >= 2 ? palette.green : palette.muted}
              icon="🌐"
            />
            {step >= 3 && <Arrow color={palette.accent3} reverse />}
          </div>
          <p
            style={{
              textAlign: "center",
              color: palette.warn,
              fontSize: 13,
              fontFamily: font,
              marginTop: 10,
            }}
          >
            {steps[step].desc}
          </p>
        </Box>
      </Section>

      <Section title="Tabla NAT del router">
        <NATTable
          columns={["IP Privada", "IP Pública", "Tipo", "Estado"]}
          rows={[
            [
              <Tag color={palette.accent}>192.168.1.100</Tag>,
              <Tag color={palette.green}>85.60.42.10</Tag>,
              "Estático",
              "✅ Permanente",
            ],
            [
              <Tag color={palette.accent}>192.168.1.101</Tag>,
              <Tag color={palette.green}>85.60.42.11</Tag>,
              "Estático",
              "✅ Permanente",
            ],
          ]}
        />
      </Section>

      <Section title="Ejemplo real: Config Cisco">
        <CodeBlock>{`! Definir la traducción estática
ip nat inside source static 192.168.1.100 85.60.42.10

! Marcar interfaces
interface GigabitEthernet0/0
 ip nat inside        ← lado LAN

interface GigabitEthernet0/1
 ip nat outside       ← lado Internet`}</CodeBlock>
      </Section>

      <Section title="Analogía dev">
        <Box style={{ background: palette.cardAlt }}>
          <CodeBlock>{`# Es como un mapeo fijo en /etc/hosts
# o un proxy_pass estático en Nginx:

server {
    listen 80;
    server_name miapp.com;         # IP pública
    location / {
        proxy_pass http://192.168.1.100:80;  # IP privada
    }
}

# Siempre el mismo origen → siempre el mismo destino`}</CodeBlock>
        </Box>
      </Section>
    </div>
  );
}

function TabDynamic() {
  const [assigned, setAssigned] = useState([]);
  const devices = [
    { name: "PC-1", ip: "192.168.1.10", icon: "💻" },
    { name: "PC-2", ip: "192.168.1.11", icon: "🖥️" },
    { name: "PC-3", ip: "192.168.1.12", icon: "📟" },
    { name: "PC-4", ip: "192.168.1.13", icon: "📱" },
  ];
  const pool = ["85.60.42.10", "85.60.42.11", "85.60.42.12"];

  const toggle = (ip) => {
    if (assigned.find((a) => a.priv === ip)) {
      setAssigned(assigned.filter((a) => a.priv !== ip));
    } else {
      const used = assigned.map((a) => a.pub);
      const free = pool.find((p) => !used.includes(p));
      if (free) {
        setAssigned([...assigned, { priv: ip, pub: free }]);
      }
    }
  };

  const getPublic = (ip) => assigned.find((a) => a.priv === ip)?.pub;

  return (
    <div>
      <Section title="¿Qué es NAT Dinámico?">
        <p style={{ color: palette.text, lineHeight: 1.75, fontSize: 14 }}>
          El router tiene un <strong style={{ color: palette.accent2 }}>pool de IPs públicas</strong> y
          las asigna bajo demanda. Cuando un dispositivo quiere salir a Internet, el router
          le presta una IP pública del pool. Cuando termina, la devuelve. Es como un{" "}
          <Tag color={palette.accent2}>connection pool</Tag> de base de datos.
        </p>
      </Section>

      <Section title="Simulación interactiva">
        <p style={{ color: palette.muted, fontSize: 12, fontFamily: font, marginBottom: 10 }}>
          Haz click en los dispositivos para que "soliciten Internet". Solo hay 3 IPs en el pool.
        </p>
        <Box glow={palette.accent2}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            {devices.map((d) => {
              const pub = getPublic(d.ip);
              return (
                <div
                  key={d.ip}
                  onClick={() => toggle(d.ip)}
                  style={{
                    cursor: "pointer",
                    padding: 12,
                    borderRadius: 12,
                    background: pub ? `${palette.accent2}15` : palette.cardAlt,
                    border: `2px solid ${pub ? palette.accent2 : palette.border}`,
                    textAlign: "center",
                    transition: "all .25s",
                    minWidth: 100,
                  }}
                >
                  <div style={{ fontSize: 28 }}>{d.icon}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: palette.text,
                      fontFamily: font,
                      marginTop: 4,
                    }}
                  >
                    {d.name}
                  </div>
                  <Tag color={palette.accent}>{d.ip}</Tag>
                  {pub ? (
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: palette.muted }}>→</span>{" "}
                      <Tag color={palette.green}>{pub}</Tag>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 11,
                        color: palette.muted,
                        fontFamily: font,
                      }}
                    >
                      sin conexión
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              textAlign: "center",
              padding: "10px 0",
              borderTop: `1px solid ${palette.border}`,
            }}
          >
            <span style={{ color: palette.muted, fontSize: 12, fontFamily: font }}>
              Pool: {pool.length} IPs públicas disponibles |{" "}
              <span style={{ color: palette.green }}>{pool.length - assigned.length} libres</span> |{" "}
              <span style={{ color: palette.accent3 }}>{assigned.length} en uso</span>
              {assigned.length >= pool.length && (
                <span style={{ color: palette.accent3, fontWeight: 700 }}>
                  {" "}
                  — ⚠️ POOL AGOTADO (PC-4 no puede salir)
                </span>
              )}
            </span>
          </div>
        </Box>
      </Section>

      <Section title="Tabla NAT (temporal)">
        <NATTable
          columns={["IP Privada", "IP Pública", "Tipo", "Estado"]}
          rows={
            assigned.length > 0
              ? assigned.map((a) => [
                  <Tag color={palette.accent}>{a.priv}</Tag>,
                  <Tag color={palette.green}>{a.pub}</Tag>,
                  "Dinámico",
                  "⏳ Temporal",
                ])
              : [["—", "—", "—", "Haz click en un dispositivo"]]
          }
        />
      </Section>

      <Section title="Problema clave">
        <Box style={{ background: `${palette.accent3}10`, border: `1px solid ${palette.accent3}33` }}>
          <p style={{ color: palette.text, fontSize: 14, lineHeight: 1.75, margin: 0 }}>
            Si tienes <strong style={{ color: palette.accent3 }}>4 dispositivos</strong> y solo{" "}
            <strong style={{ color: palette.accent3 }}>3 IPs públicas</strong>, el cuarto se queda sin Internet.
            Por eso NAT Dinámico puro casi no se usa. La solución es <strong style={{ color: palette.accent }}>PAT</strong> (siguiente pestaña),
            que permite que TODOS compartan UNA sola IP usando puertos.
          </p>
        </Box>
      </Section>

      <Section title="Config Cisco">
        <CodeBlock>{`! Definir el pool de IPs públicas
ip nat pool MI-POOL 85.60.42.10 85.60.42.12 netmask 255.255.255.0

! ACL: quién puede usar NAT
access-list 1 permit 192.168.1.0 0.0.0.255

! Vincular ACL al pool
ip nat inside source list 1 pool MI-POOL

! El router asigna IPs del pool bajo demanda
! Cuando se agota → los nuevos no pueden salir`}</CodeBlock>
      </Section>
    </div>
  );
}

function TabPAT() {
  const [connections, setConnections] = useState([
    { device: "💻 PC-1", privIp: "192.168.1.10", privPort: 54321, pubPort: 54321, dst: "93.184.216.34:443", site: "example.com" },
    { device: "📱 Móvil", privIp: "192.168.1.11", privPort: 54321, pubPort: 54322, dst: "93.184.216.34:443", site: "example.com" },
    { device: "📟 Tablet", privIp: "192.168.1.12", privPort: 12345, pubPort: 12345, dst: "142.250.185.14:443", site: "google.com" },
  ]);

  const addConn = () => {
    const newPort = 30000 + Math.floor(Math.random() * 30000);
    const sites = [
      { dst: "151.101.1.69:443", site: "reddit.com" },
      { dst: "157.240.1.35:443", site: "facebook.com" },
      { dst: "52.38.28.241:443", site: "github.com" },
    ];
    const s = sites[Math.floor(Math.random() * sites.length)];
    const devs = ["💻 PC-1", "📱 Móvil", "📟 Tablet", "🖥️ PC-2"];
    const ips = ["192.168.1.10", "192.168.1.11", "192.168.1.12", "192.168.1.13"];
    const idx = Math.floor(Math.random() * devs.length);
    setConnections([
      ...connections,
      {
        device: devs[idx],
        privIp: ips[idx],
        privPort: newPort,
        pubPort: newPort + 1,
        dst: s.dst,
        site: s.site,
      },
    ]);
  };

  return (
    <div>
      <Section title="PAT: Port Address Translation">
        <p style={{ color: palette.text, lineHeight: 1.75, fontSize: 14 }}>
          PAT (también llamado <Tag color={palette.accent3}>NAT Overload</Tag>) es el que usas
          en tu casa. Permite que <strong style={{ color: palette.accent3 }}>miles de dispositivos</strong>{" "}
          compartan <strong style={{ color: palette.accent3 }}>una sola IP pública</strong> diferenciándolos
          por el <strong style={{ color: palette.accent }}>número de puerto</strong>.
        </p>
      </Section>

      <Section title="¿Por qué puertos?">
        <Box style={{ background: palette.cardAlt }}>
          <p style={{ color: palette.text, lineHeight: 1.75, fontSize: 14 }}>
            Cada conexión TCP/UDP se identifica por una tupla de 4 valores:
          </p>
          <CodeBlock>{`(IP_origen, Puerto_origen, IP_destino, Puerto_destino)

// Tu PC abre Chrome → pestaña 1:
(192.168.1.10, 54321, 93.184.216.34, 443)

// Tu PC abre Chrome → pestaña 2:
(192.168.1.10, 54322, 93.184.216.34, 443)

// Tu móvil abre Safari:
(192.168.1.11, 54321, 93.184.216.34, 443)

// ¡El puerto origen es DIFERENTE!
// Eso es lo que PAT usa para distinguir quién es quién`}</CodeBlock>
          <p style={{ color: palette.muted, fontSize: 13, lineHeight: 1.7, marginTop: 8 }}>
            Es como un edificio de apartamentos: todos comparten la misma dirección (IP pública),
            pero cada uno tiene un número de puerta diferente (puerto).
          </p>
        </Box>
      </Section>

      <Section title="Tabla NAT/PAT en vivo">
        <p style={{ color: palette.muted, fontSize: 12, fontFamily: font, marginBottom: 8 }}>
          Todas las conexiones salen con la misma IP pública <Tag color={palette.green}>85.60.42.7</Tag>
        </p>
        <Box glow={palette.accent3}>
          <NATTable
            columns={["Dispositivo", "IP:Puerto privado", "IP:Puerto público", "Destino"]}
            rows={connections.map((c) => [
              c.device,
              <span>
                <Tag color={palette.accent}>{c.privIp}:{c.privPort}</Tag>
              </span>,
              <span>
                <Tag color={palette.green}>85.60.42.7:{c.pubPort}</Tag>
              </span>,
              <span>
                <Tag color={palette.muted}>{c.dst}</Tag>{" "}
                <span style={{ fontSize: 11, color: palette.muted }}>({c.site})</span>
              </span>,
            ])}
          />
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button
              onClick={addConn}
              style={{
                background: `${palette.accent3}22`,
                color: palette.accent3,
                border: `1px solid ${palette.accent3}55`,
                borderRadius: 8,
                padding: "8px 20px",
                cursor: "pointer",
                fontFamily: font,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              + Simular nueva conexión
            </button>
          </div>
        </Box>
      </Section>

      <Section title="El flujo completo">
        <CodeBlock>{`── TU PC quiere abrir github.com ──────────────────

1. App genera paquete:
   src: 192.168.1.10:54321 → dst: 140.82.121.4:443

2. Router NAT traduce (SNAT):
   src: 85.60.42.7:54321   → dst: 140.82.121.4:443
   └─ Guarda en tabla: {54321 → 192.168.1.10:54321}

3. GitHub responde:
   src: 140.82.121.4:443   → dst: 85.60.42.7:54321

4. Router busca en tabla PAT:
   Puerto 54321 → 192.168.1.10:54321
   
5. Router traduce (DNAT):
   src: 140.82.121.4:443   → dst: 192.168.1.10:54321
   └─ Tu PC recibe la respuesta ✅

── SI OTRO DISPOSITIVO USA EL MISMO PUERTO ────────

6. Móvil genera paquete (¡mismo puerto origen!):
   src: 192.168.1.11:54321 → dst: 140.82.121.4:443

7. Router detecta COLISIÓN → reasigna puerto:
   src: 85.60.42.7:54322   → dst: 140.82.121.4:443
   └─ Guarda: {54322 → 192.168.1.11:54321}
   
   ¡Problema resuelto! Cada conexión tiene puerto único`}</CodeBlock>
      </Section>

      <Section title="Port Forwarding (lo que configuras para tu servidor)">
        <Box style={{ background: palette.cardAlt }}>
          <p style={{ color: palette.text, lineHeight: 1.75, fontSize: 14 }}>
            PAT funciona genial para <strong>salir</strong> a Internet. Pero si alguien quiere
            <strong style={{ color: palette.accent3 }}> entrar</strong> a tu red (ej: tu API en el puerto 3000),
            necesitas <Tag color={palette.accent3}>Port Forwarding</Tag> (DNAT manual):
          </p>
          <CodeBlock>{`# "Todo lo que llegue al puerto 3000 de mi IP pública,
#  mándalo a 192.168.1.10:3000"

# En iptables (Linux):
iptables -t nat -A PREROUTING \\
  -p tcp --dport 3000 \\
  -j DNAT --to-destination 192.168.1.10:3000

# Esto es lo que haces en tu router cuando
# configuras port forwarding para tu servidor local

# Equivalente en Docker:
docker run -p 3000:3000 mi-api
# ↑ Esto es básicamente port forwarding/DNAT`}</CodeBlock>
        </Box>
      </Section>

      <Section title="¿Por qué te importa como dev?">
        <Box glow={palette.warn}>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              ["WebRTC / P2P", "NAT bloquea conexiones entrantes. Por eso necesitas STUN/TURN servers para videollamadas."],
              ["Docker -p flag", "Es literalmente port forwarding (DNAT). -p 8080:3000 mapea puerto público 8080 → container:3000."],
              ["SSH tunneling", "ssh -L 3000:db-server:5432 user@bastion — creas un NAT 'manual' por SSH."],
              ["Game servers", "Los jugadores detrás de NAT no pueden hostear directamente. Necesitan UPnP o port forwarding manual."],
              ["Kubernetes Services", "kube-proxy hace NAT (iptables rules) para enrutar tráfico a pods."],
            ].map(([title, desc]) => (
              <div key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: palette.warn, fontSize: 14 }}>▸</span>
                <div>
                  <strong style={{ color: palette.warn, fontFamily: font, fontSize: 13 }}>{title}</strong>
                  <p style={{ color: palette.muted, fontSize: 13, margin: "2px 0 0" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Section>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────

export default function NATGuide() {
  const [tab, setTab] = useState(0);
  const colors = [palette.accent, palette.accent, palette.accent2, palette.accent3];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        fontFamily: `'Segoe UI', system-ui, sans-serif`,
        color: palette.text,
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: font,
              fontSize: 28,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2}, ${palette.accent3})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
              letterSpacing: -1,
            }}
          >
            NAT — Network Address Translation
          </h1>
          <p style={{ color: palette.muted, fontSize: 13, fontFamily: font, marginTop: 6 }}>
            Guía visual e interactiva para developers
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 24,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              style={{
                background: tab === i ? `${colors[i]}18` : "transparent",
                color: tab === i ? colors[i] : palette.muted,
                border: `1px solid ${tab === i ? `${colors[i]}55` : palette.border}`,
                borderRadius: 10,
                padding: "10px 18px",
                cursor: "pointer",
                fontFamily: font,
                fontSize: 13,
                fontWeight: tab === i ? 700 : 400,
                whiteSpace: "nowrap",
                transition: "all .2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 0 && <TabIntro />}
        {tab === 1 && <TabStatic />}
        {tab === 2 && <TabDynamic />}
        {tab === 3 && <TabPAT />}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 32,
            padding: "16px 0",
            borderTop: `1px solid ${palette.border}`,
            color: palette.muted,
            fontSize: 11,
            fontFamily: font,
          }}
        >
          NAT Guide — Explicado para devs que quieren entender redes
        </div>
      </div>
    </div>
  );
}
