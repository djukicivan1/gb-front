<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-text-field v-model="email" label="Email" />
            <v-text-field
              v-model="password"
              @keyup.enter="doLogin"
              label="Password"
              type="password"
            />
            <div class="text-caption">
              Example accounts: <i>rwest@example.org</i>, <i>keyshawn37@example.net (admin)</i>,
              <i>qflatley@example.com</i>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn :loading="loading" @click="doLogin" @keyup.enter="doLogin" color="green" block>Login</v-btn>
          </v-card-actions>
          <v-alert v-if="error" type="error" class="ma-4">{{ error }}</v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import http from '../api/http'
import { setAuth } from '../auth'
import router from '../router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function doLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Enter email and password'
    return
  }
  loading.value = true
  try {
    const res = await http.post('/login', null, {
      params: { email: email.value, password: password.value },
    })
    const token = res.data?.token || res.data?.data?.token
    if (!token) throw new Error('Missing token')

    setAuth({ token, user: { email: email.value, role: 'user' } })

    const usersRes = await http.get('/user')
    const users = usersRes.data?.data || usersRes.data || []
    const me = users.find((u) => (u.email || '').toLowerCase() === email.value.toLowerCase())
    const role = (me?.role || 'user').toLowerCase()
    setAuth({ token, user: { id: me?.id, name: me?.name, email: email.value, role } })
    router.push('/home')
  } catch (e) {
    error.value = e?.response?.data?.message || 'Login failed'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
