<template>
  <v-container>
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5">Welcome, {{ user?.name?.split(' ')[0] }}!</h2>
      </v-col>
    </v-row>

    <v-row>
      <!-- Tasks -->
      <v-col cols="12" sm="4">
        <v-card class="hover-card" variant="outlined" @click="$router.push('/tasks')">
          <v-card-title>Tasks</v-card-title>
          <v-card-text>View, search and CRUD for tasks.</v-card-text>
          <v-card-actions>
            <v-btn to="/tasks" color="green">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Users (only admin) -->
      <v-col cols="12" sm="4" v-if="isAdmin">
        <v-card class="hover-card" variant="outlined" @click="$router.push('/users')">
          <v-card-title>Users</v-card-title>
          <v-card-text>View, search and CRUD for users.</v-card-text>
          <v-card-actions>
            <v-btn to="/users" color="green">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Vehicles -->
      <v-col cols="12" sm="4">
        <v-card class="hover-card" variant="outlined" @click="$router.push('/vehicles')">
          <v-card-title>Vehicles</v-card-title>
          <v-card-text>View, search and CRUD for vehicles.</v-card-text>
          <v-card-actions>
            <v-btn to="/vehicles" color="green">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { getUser } from '../auth'

const user = getUser()
const isAdmin = computed(() => (user?.role || 'user') === 'admin')
</script>

<style scoped>
.hover-card { cursor: pointer; }
</style>
