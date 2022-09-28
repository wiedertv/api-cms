import { registerEnumType } from '@nestjs/graphql'

export enum DelegationEnum {
    cancilleria = 'cancilleria',
    castilla = 'castilla',
    andalucia = 'andalucia',
    asturias = 'asturias',
    baleares = 'baleares',
    canarias = 'canarias',
    cantabria = 'cantabria',
    cataluna = 'cataluna',
    galicia = 'galicia',
    madrid = 'madrid',
    navarraYAragon = 'navarraYAragon',
    valencia = 'valencia',
    none = '',
}

registerEnumType(DelegationEnum, {
  name: 'Delegations'
})
