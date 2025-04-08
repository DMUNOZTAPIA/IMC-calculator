document.addEventListener("DOMContentLoaded", () => {
  const nombreInput = document.getElementById("nombre");
  const pesoInput = document.getElementById("peso");
  const estaturaInput = document.getElementById("estatura");
  const boton = document.getElementById("calcular");
  const resultadoIMC = document.getElementById("resultado-imc");
  const listaRanking = document.getElementById("ranking-lista");

  const RANGO_SALUDABLE = { min: 18.5, max: 24.9 };
  let usuarios = JSON.parse(localStorage.getItem("usuariosIMC")) || [];

  function calcularIMC(peso, estatura) {
    return peso / (estatura * estatura);
  }

  function guardarUsuario(nombre, imc) {
    const id = Date.now();
    usuarios.push({ id, nombre, imc });
    localStorage.setItem("usuariosIMC", JSON.stringify(usuarios));
  }

  function eliminarUsuario(id) {
    usuarios = usuarios.filter((u) => u.id !== id);
    localStorage.setItem("usuariosIMC", JSON.stringify(usuarios));
    renderRanking();
  }

  function clasificarIMC(imc) {
    const bajoPeso = "Bajo peso 💀💀💀 ";
    const saludable = "Peso saludable 💪💪💪";
    const sobrePeso = "Sobrepeso 🍔🍟🍕";
    const obesidad = "Obesidad 🎂🍰🧁";
    if (imc < 18.5) return bajoPeso;
    if (imc >= 18.5 && imc <= 24.9) return saludable;
    if (imc >= 25 && imc <= 29.9) return sobrePeso;
    if (imc >= 30) return obesidad;
  }

  function renderRanking() {
    listaRanking.innerHTML = "";

    const saludables = usuarios.sort(
      (a, b) => Math.abs(21.7 - a.imc) - Math.abs(21.7 - b.imc)
    );

    saludables.forEach((usuario, index) => {
      const clasificacion = clasificarIMC(usuario.imc);
      const li = document.createElement("li");
      li.innerHTML = `
                <span>#${index + 1} - ${usuario.nombre}: IMC ${Math.floor(
        usuario.imc
      )} (${clasificacion})</span>
                <button onclick="eliminarUsuario(${
                  usuario.id
                })">Eliminar</button>
            `;
      listaRanking.appendChild(li);
    });
  }

  boton.addEventListener("click", () => {
    const nombre = nombreInput.value.trim();
    const peso = parseFloat(pesoInput.value);
    const estatura = parseFloat(estaturaInput.value);

    if (
      !nombre ||
      isNaN(peso) ||
      isNaN(estatura) ||
      peso <= 0 ||
      estatura <= 0
    ) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    const imc = calcularIMC(peso, estatura);
    const imcRedondeado = imc.toFixed(2);
    const clasificacion = clasificarIMC(imc);

    resultadoIMC.textContent = `${imcRedondeado} - ${clasificacion}`;

    guardarUsuario(nombre, imc);
    renderRanking();

    nombreInput.value = "";
    pesoInput.value = "";
    estaturaInput.value = "";
  });

  // Hacer función global para los botones eliminar
  window.eliminarUsuario = eliminarUsuario;

  renderRanking();
});
