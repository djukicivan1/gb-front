import http from './http'


export const usersApi = {
  list() { return http.get('/user') },
  get(id) { return http.get(`/user/${id}`) },
  create({ name, email, password, role }) {
    return http.post('/user', null, { params: { name, email, password, role } })
  },
  update(id, data) { return http.put(`/user/${id}`, data) }, //try
  remove(id) { return http.delete(`/user/${id}`) },
}

export const tasksApi = {
  list() { return http.get('/task') },
  get(id) { return http.get('/task', { params: { id } }) },
  create({ title, description, due_date }) {
    return http.post('/task', null, { params: { title, description, due_date } })
  },
  update(id, data) { return http.put(`/task/${id}`, data) }, //try
  async remove(id) {
    try { return await http.delete(`/task/${id}`) }
    catch (e) { return http.delete('/task', { params: { [id]: null } }) }
  }
}

export const vehiclesApi = {
  list() { return http.get('/vehicle') },
  get(id) { return http.get(`/vehicle/${id}`) },
  create({ title, brand, licence_plate, year }) {
    return http.get('/vehicle', { params: { title, brand, licence_plate, year } })
  },
  update(id, data) { return http.put(`/vehicle/${id}`, data) }, //try
  remove(id) { return http.delete(`/vehicle/${id}`) },
}
