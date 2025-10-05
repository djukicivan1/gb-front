import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import colors from 'vuetify/util/colors'

const purpleTheme = {
  dark: false,
  colors: {
    background: colors.grey.lighten5,
    surface: colors.grey.lighten4,
    primary: colors.deepPurple.base,
    'primary-darken-1': colors.deepPurple.darken1,
    secondary: colors.purple.accent2,
    error: colors.red.accent3,
    info: colors.blue.base,
    success: colors.green.base,
    warning: colors.orange.base,
  },
}

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'purpleTheme',
    themes: { purpleTheme },
  },
})
