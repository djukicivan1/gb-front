<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>Prijava</v-card-title>
            <v-card-text>
              <v-text-field v-model="email" label="Email" />
              <v-text-field v-model="password" label="Password" type="password" />
              <div class="text-caption">
                Primjer nalozi: rwest@example.org, keyshawn37@example.net, qflatley@example.com, erik.hand@example.com; password: <b>password</b>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="loading" @click="doLogin" block>Login</v-btn>
            </v-card-actions>
            <v-alert v-if="error" type="error" class="ma-4">{{ error }}</v-alert>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import http from '../api/http'
  import { setAuth } from '../auth'
  
  export default {
    name: 'LoginView',
    data() {
      return { email: '', password: '', loading: false, error: '' }
    },
    methods: {
      async doLogin() {
        this.error = ''
        this.loading = true
        try {
          const res = await http.post('/login', null, { params: { email: this.email, password: this.password } })
          const token = res.data?.token || res.data?.data?.token
          const user = res.data?.user || res.data?.data?.user || { email: this.email, role: res.data?.role || 'user' }
          if (!token) throw new Error('Token is not received')
          setAuth({ token, user })
          this.$router.push('/')
        } catch (e) {
          this.error = 'Login failed'
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  