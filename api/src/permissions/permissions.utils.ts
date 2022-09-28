export const parsePermissions = (data, user) => {
  return data.filter((v) => {
    v.allowed = v.allowed.map((value) => {
      switch (value) {
        case 'Miembros':
          return 'miembro'
        case 'Voluntarios':
          return 'voluntario'
        case 'Empleados':
          return 'empleado'
        case 'Beneficiarios':
          return 'beneficiario'
        case 'Amigos':
          return 'amigo'
        case 'Contactos de interés':
          return 'contactoInteres'
        default:
          return null
      }
    })
    return v.allowed.includes(user)
  })
}
