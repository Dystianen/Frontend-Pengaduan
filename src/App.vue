<template>  
  <div id="app">
    <div class="container-scroller">
      <router-view name="header" />
        <div class="container-fluid page-body-wrapper">
          <div class="main-panel">
            <router-view />
          </div>
        </div>
      <router-view name=""/>
    </div>
  </div>
</template>

<script>
// import Navbar from '../components/layouts/Navbar.vue'
export default {
  name: 'App'
}
</script>
