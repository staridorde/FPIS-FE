<template>
<el-container>
  <el-header>
    <el-menu
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-sub-menu index="1">
        <template #title>Klijent</template>
        <el-menu-item index="1-1">Unos novog klijenta</el-menu-item>
        <el-menu-item index="1-2">Izmena informacija o klijentu</el-menu-item>
        <el-menu-item index="1-3">Pretraga klijenata</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>Tehnicki uslovi</template>
        <el-menu-item index="2-1">Unos zahteva</el-menu-item>
        <el-menu-item index="2-2">Izmena zahteva</el-menu-item>
        <el-menu-item index="2-3">Pretraga zahteva</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-header>
  <el-main>    
    <router-view/>
  </el-main>
</el-container>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    // eslint-disable-next-line no-unused-vars
    const route = useRoute()
    const router = useRouter()

    const handleSelect = (key, keyPath) => {
      const [parentKey, childKey] = keyPath
      const routerObj = { path: '' }
      switch(parentKey) {
        case '1':
          switch(childKey) {
            case '1-1':
              routerObj.path = '/unosKlijenta'
              break
            case '1-2':
              routerObj.path = '/izmenaKlijenta'
              break
            case '1-3':
              routerObj.path = '/pretragaKlijenta'
              break
          }
          break
        case '2':
          switch(childKey) {
            case '2-1':
              routerObj.path = '/unosZahteva'
              break
          }
          break
      }
      router.push(routerObj)
    }

    return {
      handleSelect,
    }
  },
}
</script>

<style>
* {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
