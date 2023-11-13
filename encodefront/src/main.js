const axios = require("axios");
const { ipcRenderer } = require("electron");
const QRCode = require("qrcode");
let socket;

document.addEventListener("DOMContentLoaded", function (event) {
  setTimeout(() => {
    document.querySelector("#closeBtn").onclick = function () {
      ipcRenderer.send("closeApp");
    };

    document.querySelector("#minimizeBtn").onclick = function () {
      ipcRenderer.send("minimizeApp");
    };

    document.querySelector("#maximizeBtn").onclick = function () {
      ipcRenderer.send("maximizeApp");
    };

    document.querySelector("#addQR").onclick = function () {
      const countQR = document.querySelector("#countQR").value;
      axios
        .get(`http://localhost:3010/api/insert?countQR=${countQR}`, {})
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    document.querySelector("#printQR").onclick = function () {
      const countQR = document.querySelector("#countQR").value;
      const sizeQR = document.querySelector("#sizeQR").value;

      if (sizeQR <= 0) {
        alert("Недопустимое значение размера", "Ошибка!");
      }
      if (countQR <= 0) {
        alert("Недопустимое количество", "Ошибка!");
      }

      axios
        .get(`http://localhost:3010/api/select?countQR=${countQR}`, {})
        .then((response) => {
          //Создаем модальное окно для печати
          const modal = window.open();
          modal.document.body.innerHTML = "<div class='qrcodes'></div>";

          let countImg = 0;

          response.data.forEach(function (item) {
            const div = modal.document.createElement("div");
            div.setAttribute("style", "margin-bottom: 100vh;");

            //Вывод полученых кодов на модальное окно
            QRCode.toDataURL(`${item}`, (err, url) => {
              div.innerHTML = `<img src='${url}' style='height: ${sizeQR}px;width: ${sizeQR}px; loading: eager'>`;
              modal.document.querySelector(".qrcodes").appendChild(div);
              countImg += 1;
            });
          });

          if (countImg <= countQR) {
            setTimeout(() => {
              modal.print();
              modal.close();
            }, countQR * 10);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    // Подлкючение сканера и вывод информации отсканированного кода

    document.getElementById("connect").onclick = function () {
      socket = new WebSocket("ws://localhost:3000/");

      socket.onopen = () => {
        socket.send("Подключение установлено");
        alert(`Подключение установлено`);
        document
          .getElementById("connect")
          .setAttribute("style", "display: none");
        document
          .getElementById("disconnect")
          .setAttribute("style", "display: inline");
      };

      socket.onclose = () => {
        alert("Подключение разорвано");
        document
          .getElementById("connect")
          .setAttribute("style", "display: inline");
        document
          .getElementById("disconnect")
          .setAttribute("style", "display: none");
        document.querySelector(".idProd").textContent = "";
        document.querySelector(".statusProd").textContent = "";
      };

      socket.onmessage = (event) => {
        axios
          .get(`http://localhost:3010/api/scan?code=${event.data}`, {})
          .then((response) => {
            response.data.forEach(function (item) {
              document.querySelector(".idProd").textContent = `${item[0]}`;
              document.querySelector(".statusProd").textContent = `${item[1]}`;
            });
          })
          .catch((error) => {
            console.error(error);
          });
      };
    };

    document.getElementById("disconnect").onclick = function () {
      socket.close(1000);
    };
  }, 1000);
});
