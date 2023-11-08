<template>
  <div class="titlebar">
    <div>
      <span class="company">ENCODE</span>
    </div>
    <div class="groupbtn">
      <button id="minimizeBtn">&#x2014;</button>
      <button id="maximizeBtn">&#x2610;</button>
      <button id="closeBtn">&#x2716;</button>
    </div>
  </div>

  <router-view />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>
