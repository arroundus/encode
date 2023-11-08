<template>
  <q-page class="flex flex-center">
    <div class="settings">
      <h5 class="flex flex-center">Форма для печати</h5>
      <span class="flex flex-center">Количество QR кодов</span>
      <div class="flex flex-center">
        <input type="number" id="countQR" value="5" />
      </div>
      <span class="flex flex-center">Размер QR кодов (px)</span>
      <div class="flex flex-center">
        <input type="number" id="sizeQR" value="100" />
      </div>
      <div class="flex flex-center">
        <q-btn
          title="Печать"
          push
          color="black"
          text-color="white"
          round
          icon="print"
          id="printQR"
        />
        <q-btn
          title="Добавить новые коды"
          push
          color="black"
          text-color="white"
          round
          icon="style"
          id="addQR"
        />
      </div>
      <div class="whois">
        <h5 class="flex flex-center">Информация продукта</h5>
        <span class="flex flex-center device-connect-title"
          >Устройство сканирования</span
        >
        <div class="flex flex-center device-connect">
          <button id="connect">Подключить устройство</button>
          <button id="disconnect">Отключить устройство</button>
        </div>

        <q-markup-table>
          <tbody>
            <tr>
              <td class="text-left">ID продукта</td>
              <td class="text-right idProd"></td>
            </tr>
            <tr>
              <td class="text-left">Статус</td>
              <td class="text-right statusProd"></td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script>
