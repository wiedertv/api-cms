import { registerEnumType } from '@nestjs/graphql'

export enum RoleEnum {
    Admin= 'Admin',
    miembro='miembro',
    voluntario='voluntario',
    empleado ='empleado',
    beneficiario ='beneficiario',
    amigo ='amigo',
    contactoInteres ='contactoInteres',
}

registerEnumType(RoleEnum, {
  name: 'Roles'
})
