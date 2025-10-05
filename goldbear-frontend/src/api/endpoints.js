import http from './http'

export const usersApi = {
  list() {
    return http.get('/user')
  },
  get(id) {
    return http.get(`/user/${id}`)
  },
  create({ name, email, password, role }) {
    return http.post('/user', null, { params: { name, email, password, role } })
  },
  update(id, { name, email, password, role }) {
    return http.post('/user', null, { params: { id, name, email, password, role } })
  },
  remove(id) {
    return http.delete(`/user/${id}`)
  },
}

export const tasksApi = {
  list() {
    return http.get('/task')
  },
  get(id) {
    return http.get('/task', { params: { id } })
  },
  create({ title, description, due_date }) {
    return http.post('/task', null, { params: { title, description, due_date } })
  },
  update(id, { title, description, due_date }) {
    return http.post('/task', null, { params: { id, title, description, due_date } })
  },
  async remove(id) {
    try {
      return await http.delete(`/task/${id}`)
    } catch {
      return http.delete('/task', { params: { [id]: null } })
    }
  },
}

export const vehiclesApi = {
  list() {
    return http.get('/vehicle')
  },
  get(id) {
    return http.get(`/vehicle/${id}`)
  },
  create({ title, brand, licence_plate, year }) {
    return http.post('/vehicle', null, { params: { title, brand, licence_plate, year } })
  },
  update(id, { title, brand, licence_plate, year }) {
    return http.post('/vehicle', null, { params: { id, title, brand, licence_plate, year } })
  },
  remove(id) {
    return http.delete(`/vehicle/${id}`)
  },
}
