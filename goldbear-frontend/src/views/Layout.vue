<template>
    <v-layout>
      <v-app-bar app>
        <v-app-bar-title>GoldBear Demo</v-app-bar-title>
        <v-spacer />
        <div class="mr-4">{{ user?.email }} ({{ user?.role || 'user' }})</div>
        <v-btn variant="text" color="red" @click="logout">Logout</v-btn>
      </v-app-bar>
  
      <v-navigation-drawer app>
        <v-list density="compact" nav>
          <v-list-item to="/tasks" title="Tasks" />
          <v-list-item to="/vehicles" title="Vehicles" />
          <v-list-item v-if="(user?.role || 'user') === 'admin'" to="/users" title="Users" />
        </v-list>
      </v-navigation-drawer>
  
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </template>
  
  <script>
  import { getUser, clearAuth } from '../auth'
  
  export default {
    name: 'Layout',
    data() {
      return { user: getUser() }
    },
    methods: {
      logout() {
        clearAuth()
        this.$router.push('/login')
      }
    }
  }
  </script>
  