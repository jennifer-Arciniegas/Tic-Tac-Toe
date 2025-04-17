document.addEventListener("DOMContentLoaded", () => {
  let jugador1 = document.getElementById("alias1");
  let jugador2 = document.getElementById("alias2");
  const jugar = document.getElementById("jugar");
  let turno = document.getElementById("turnojugador");
  const tablero = document.getElementById("tablero");
  const celdas = Array.from(tablero.children);
  let ganadorDisplay = document.getElementById("display");
  let showHistorial = document.getElementById("ranking");
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  const modalImage = document.getElementById("modalImage");
  const closeModal = document.getElementById("closeModal");
  let historial = JSON.parse(localStorage.getItem("ranking")) || [];
  let puntos;
  const espacioHistorial = document.getElementById("insertarHistorial");
  let jugadorActual;
  let estadoJuego = ["", "", "", "", "", "", "", "", ""];
  let juegoActivo = false;

  const combinacionGanadora = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  jugar.addEventListener("click", function iniciarJuego(elemento) {
    elemento.preventDefault();
    if (!jugador1.value || !jugador2.value) {
      alert("Ingrese los nombres de los jugadores");
      return;
    }
    juegoActivo = true;
    jugadorActual = jugador1.value;
    turno.textContent = `Es el turno del jugador ${jugadorActual}`;
    estadoJuego.fill("");
    celdas.forEach((celda) => (celda.textContent = ""));
    ganadorDisplay.textContent = "";
    modal.classList.add("hidden");
  });

  celdas.forEach((celda, index) => {
    celda.addEventListener("click", () => {
      if (!juegoActivo || estadoJuego[index]) return;
      estadoJuego[index] = jugadorActual === jugador1.value ? "X" : "O";
      celda.textContent = estadoJuego[index];

      const resultado = verificarGanador();
      if (resultado) {
        ganadorDisplay.textContent = `El ganador es ${jugadorActual}`;
        modalImage.src="./src/img/fox.png";
        modalMessage.textContent = `¡${jugadorActual} ha ganado!`;
        modal.classList.remove("hidden");
        juegoActivo = false;
        puntos = 5;
        guardarenHistorial(jugadorActual, puntos);
        return;
      }

      if (!estadoJuego.includes("")) {
        ganadorDisplay.textContent = "Empate";
        
        modalMessage.textContent = "¡El juego ha terminado en empate!";
        modal.classList.remove("hidden");
        puntos = 2;
        guardarenHistorial([jugador1.value, jugador2.value], puntos);
        juegoActivo = false;
        return;
      }

      jugadorActual =
        jugadorActual === jugador1.value ? jugador2.value : jugador1.value;
      turno.textContent = `Es turno de ${jugadorActual}`;
    });
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    juegoActivo = false;
    estadoJuego.fill("");
    celdas.forEach((celda) => (celda.textContent = ""));
    ganadorDisplay.textContent = "";
    turno.textContent = "Turno de: ";
    jugadorActual = null;
  });

  function verificarGanador() {
    for (let combinacion of combinacionGanadora) {
      const [a, b, c] = combinacion;
      if (
        estadoJuego[a] &&
        estadoJuego[a] === estadoJuego[b] &&
        estadoJuego[a] === estadoJuego[c]
      ) {
        return estadoJuego[a];
      }
    }
    return null;
  }

  function guardarenHistorial(ganador, puntos) {
    const fecha = new Date().toLocaleString();
    if (Array.isArray(ganador)) {
      ganador.forEach((j) => historial.push({ ganador: j, fecha, puntos }));
    } else {
      historial.push({ ganador, fecha, puntos });
    }
    localStorage.setItem("ranking", JSON.stringify(historial));
  }

  showHistorial.addEventListener("click", function tablaHistorial(e) {
    e.preventDefault();
    espacioHistorial.innerHTML = "";
    const divHistorial = document.createElement("div");
    divHistorial.classList.add("tablitaHistorial", "mt-5", "w-full");

    const tabla = document.createElement("table");
    tabla.classList.add(
      "table-auto",
      "w-full",
      "border-collapse",
      "border",
      "border-indigo-500"
    );

    const cabecera = document.createElement("tr");
    cabecera.innerHTML = `
                    <th class="border border-indigo-500 p-2">Ganador</th>
                    <th class="border border-indigo-500 p-2">Fecha y hora</th>
                    <th class="border border-indigo-500 p-2">Puntos</th>`;
    tabla.append(cabecera);

    historial.forEach((elemento) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                        <td class="border border-indigo-500 p-2">${elemento.ganador}</td>
                        <td class="border border-indigo-500 p-2">${elemento.fecha}</td>
                        <td class="border border-indigo-500 p-2">${elemento.puntos}</td>`;
      tabla.appendChild(row);
    });

    // Create "Ocultar" button
    const ocultarBtn = document.createElement("button");
    ocultarBtn.textContent = "Ocultar";
    ocultarBtn.classList.add(
      "rounded-lg",
      "bg-red-300",
      "p-2",
      "mt-4",
      "hover:bg-red-500",
      "text-white",
      "font-semibold"
    );
    ocultarBtn.addEventListener("click", () => {
      espacioHistorial.innerHTML = "";
    });

    divHistorial.appendChild(tabla);
    divHistorial.appendChild(ocultarBtn);
    espacioHistorial.appendChild(divHistorial);
  });
});
