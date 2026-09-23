const apiURL = "https://6aa5fac1d7765db98507208b.mockapi.io/invitados";

const player = document.getElementById("player");
const activarSonido = document.getElementById("activarSonido");

activarSonido.addEventListener("click", async () => {
  player.muted = false;

  try {
    await player.play();
    activarSonido.textContent = "🔊 Sonido activado";
  } catch (error) {
    console.error("No se pudo reproducir la música:", error);
  }
});

document.getElementById("copiarAlias").addEventListener("click", async () => {
  const alias = document.getElementById("aliasBancario").textContent.trim();
  const mensajeAlias = document.getElementById("mensajeAlias");

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(alias);
    } else {
      const textoTemporal = document.createElement("textarea");
      textoTemporal.value = alias;
      document.body.appendChild(textoTemporal);
      textoTemporal.select();
      document.execCommand("copy");
      textoTemporal.remove();
    }

    mensajeAlias.textContent = "Alias copiado";
  } catch (error) {
    mensajeAlias.textContent = "No se pudo copiar. Alias: " + alias;
    console.error("No se pudo copiar el alias:", error);
  }
});

// Registrar invitado
document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const asistencia = document.getElementById("asistencia").value;

  const nuevoInvitado = { nombre, asistencia };
  await fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoInvitado)
  });

  alert("Registro enviado con éxito 🎉");
  e.target.reset();
});

function iniciarCuentaRegresiva(fechaEvento) {
  const countdown = document.getElementById("countdown");

  function actualizar() {
    const ahora = new Date();
    const diferencia = fechaEvento - ahora;

    if (diferencia <= 0) {
      countdown.innerHTML = "¡El gran día ha llegado! 🎉";
      clearInterval(intervalo);
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    countdown.innerHTML = `Faltan ${dias} días, ${horas} horas, ${minutos} minutos y ${segundos} segundos 💖`;
  }

  actualizar();
  const intervalo = setInterval(actualizar, 1000);
}

// Configuración: fecha del evento
const fechaEvento = new Date("2026-10-30T22:00:00");
iniciarCuentaRegresiva(fechaEvento);







async function obtenerFechaEvento() {
  try {
    // URL de tu endpoint en Mokapi
    const respuesta = await fetch("https://6aa6ae8bd7765db985078400.mockapi.io/fechadeevento/1");
    const data = await respuesta.json();

    // Asegurate que el JSON tenga un campo "fecha" en formato ISO
    // Ejemplo: { "fecha": "2026-10-30T22:00:00" }
    const fechaEvento = new Date(data.fecha);

    iniciarCuentaRegresiva(fechaEvento);
  } catch (error) {
    console.error("Error al obtener la fecha del evento:", error);
  }
}

obtenerFechaEvento();

document.getElementById("verInvitados").addEventListener("click", async () => {
  try {
    const respuesta = await fetch(apiURL);
    const invitados = await respuesta.json();

    // Si el endpoint devuelve un array, asegurate que sea así:
    if (!Array.isArray(invitados)) {
      console.error("El endpoint no devolvió un array de invitados");
      return;
    }

    let van = 0;
    let noVan = 0;
    let tabla = `
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Asistencia</th>
          </tr>
        </thead>
        <tbody>
    `;

    invitados.forEach(i => {
      const asistencia = i.asistencia.toLowerCase();
      const claseAsistencia = asistencia === "sí" ? "asiste" : "no-asiste";

      if (asistencia === "sí") {
        van++;
      } else if (asistencia === "no") {
        noVan++;
      }

      tabla += `
        <tr>
          <td>${i.nombre}</td>
          <td><span class="estado-asistencia ${claseAsistencia}">${i.asistencia}</span></td>
        </tr>
      `;
    });

    tabla += `</tbody></table>`;

    document.getElementById("resultado").innerHTML = `
      <div class="resumen-asistencia" aria-label="Resumen de asistencia">
        <div class="resumen-card asisten">
          <span class="resumen-icono">✓</span>
          <span class="resumen-etiqueta">Asisten</span>
          <strong class="resumen-numero">${van}</strong>
          <span class="resumen-detalle">invitados confirmados</span>
        </div>
        <div class="resumen-card no-asisten">
          <span class="resumen-icono">×</span>
          <span class="resumen-etiqueta">No asisten</span>
          <strong class="resumen-numero">${noVan}</strong>
          <span class="resumen-detalle">invitados ausentes</span>
        </div>
      </div>
      <div class="detalle-invitados">
        <h3>Detalle de invitados</h3>
        ${tabla}
      </div>
    `;

  } catch (error) {
    console.error("Error al obtener invitados:", error);
  }
});
// Clave secreta (puede ser cualquier string)
const claveCorrecta = "quince2026";

document.getElementById("acceder").addEventListener("click", () => {
  const claveIngresada = document.getElementById("clave").value;
  
  if (claveIngresada === claveCorrecta) {
    document.getElementById("zonaPrivada").style.display = "block";
    alert("Acceso concedido ✅");
  } else {
    alert("Clave incorrecta ❌");
  }
});

