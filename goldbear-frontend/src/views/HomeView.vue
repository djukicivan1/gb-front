<template>
    <v-container>
      <v-row class="mb-6">
        <v-col cols="12">
          <h2 class="text-h5">Welcome!</h2>
          <div class="text-body-2">Choose section:</div>
        </v-col>
      </v-row>
  
      <v-row>
        <!-- Tasks -->
        <v-col cols="12" sm="4">
          <v-card class="hover-card" variant="outlined" @click="$router.push('/tasks')">
            <v-card-title>Tasks</v-card-title>
            <v-card-text>View, search and CRUD for tasks.</v-card-text>
            <v-card-actions>
              <v-btn to="/tasks">Open</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
  
        <!-- Users (only admin) -->
        <v-col cols="12" sm="4" v-if="isAdmin">
          <v-card class="hover-card" variant="outlined" @click="$router.push('/users')">
            <v-card-title>Users</v-card-title>
            <v-card-text>View, search and CRUD for users.</v-card-text>
            <v-card-actions>
              <v-btn to="/users">Open</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
  
        <!-- Vehicles -->
        <v-col cols="12" sm="4">
          <v-card class="hover-card" variant="outlined" @click="$router.push('/vehicles')">
            <v-card-title>Vehicles</v-card-title>
            <v-card-text>View, search and CRUD for vehicles.</v-card-text>
            <v-card-actions>
              <v-btn to="/vehicles">Open</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { getUser } from '../auth'
  
  export default {
    name: 'HomeView',
    data() {
      return { user: getUser() }
    },
    computed: {
      isAdmin() {
        return (this.user?.role || 'user') === 'admin'
      }
    }
  }
  </script>
  
  <style scoped>
  .hover-card { cursor: pointer; }
  </style>
  