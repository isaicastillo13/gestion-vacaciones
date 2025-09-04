(() => {
  const App = {
    html: {
      noColaborador: document.querySelector("#noColaborador"),
      botonConsultarDias: document.querySelector("#btnConsultar"),
      diasDisponibles: document.querySelector("#diasDisponibles"),

      // cards
      cardDiasDisponibles: document.querySelector("#cardDiasDisponibles"),
      cardDiasMaximos: document.querySelector("#cardDiasMaximos"),

      // message
      errorMessage: document.querySelector("#error-message"),
      infoMessage: document.querySelector("#info-message"),
      warningMessage: document.querySelector("#warning-message"),
      dangerMessage: document.querySelector("#danger-message"),
    },
    // data:{},
    init() {
      App.bindEvents();
    },
    bindEvents() {
      App.handlers.handleClick();
      App.handlers.handleChange();
      App.handlers.handleKeydown();
    },
    handlers: {
      handleClick() {
        App.html.botonConsultarDias.addEventListener("click", () => {
          if (!App.html.noColaborador.value) {
            App.methods.renderMessage();

            return;
          } else {
            App.methods.obtenerDiasVacaciones();
          }
        });
      },
      handleKeydown() {
        App.html.noColaborador.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault(); // Evita el comportamiento por defecto del Enter
            console.log("Enter pressed");
          }
        });
      },
      handleChange() {
        App.html.noColaborador.addEventListener("input", () => {
          App.html.botonConsultarDias.disabled = !App.html.noColaborador.value;
          App.html.cardDiasDisponibles.classList.add("d-none");
          App.html.cardDiasMaximos.classList.add("d-none");
          App.html.infoMessage.classList.add("d-none");
          App.html.warningMessage.classList.add("d-none");
          App.html.dangerMessage.classList.add("d-none");
        });
      },
    },
    methods: {
      async obtenerDiasVacaciones() {
        try {
          const res = await fetch(
            "http://gr-hq-shweb-01:5335/wbahanaquery/api/colaboradores/GetColaborador?id=" + App.html.noColaborador.value);
            
          let data = await res.json();
          App.methods.renderDiasVacaciones(data);
        } catch (error) {
          console.error(
            "Ha ocurrido un error al obtener los días de vacaciones",
            error
          );
        }
      },
      async renderMessage(
        message = "❌ Ingresa un número de colaborador válido.",
        delay = 1000,
        hideAfter = 3000
      ) {
        const errorEl = App.html.errorMessage;
        errorEl.textContent = message;

        setTimeout(() => {
          errorEl.classList.remove("d-none");
          App.html.cardDiasDisponibles.classList.add("d-none");
          App.html.cardDiasMaximos.classList.add("d-none");

          setTimeout(() => {
            errorEl.classList.add("d-none");
          }, hideAfter);
        }, delay);
      },

      renderDiasVacaciones(data) {
        // Lógica para renderizar los días de vacaciones en el DOM
        let diasDisponibles = data.TOTAL;
        App.html.diasDisponibles.textContent = diasDisponibles;
        App.html.cardDiasDisponibles.classList.remove("d-none");
        App.html.cardDiasMaximos.classList.remove("d-none");

        if (diasDisponibles >= 0 && diasDisponibles <= 39) {
          App.html.cardDiasDisponibles.classList.add(
            "bg-success-subtle",
            "text-success-emphasis"
          );
          App.html.infoMessage.classList.remove("d-none");
        } else if (diasDisponibles >= 40 && diasDisponibles <= 44) {
          App.html.cardDiasDisponibles.classList.add(
            "bg-warning-subtle",
            "text-warning-emphasis"
          );
          App.html.warningMessage.classList.remove("d-none");
        } else if (diasDisponibles >= 45) {
          App.html.cardDiasDisponibles.classList.add(
            "bg-danger-subtle",
            "text-danger-emphasis"
          );
          App.html.dangerMessage.classList.remove("d-none");
        }
      },
    },
  };

  App.init();
})();
