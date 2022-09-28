import { registerEnumType } from '@nestjs/graphql';

export enum MailerSettingsEnum {
    Asamblea = 'Asamblea',
    Cancilleria = 'Cancilleria',
    Andalucia = 'Andalucia',
    Asturias = 'Asturias',
    Baleares = 'Baleares',
    Canarias = 'Canarias',
    Cantabria = 'Cantabria',
    Castilla = 'Castilla',
    Cataluna = 'Cataluña',
    Galicia = 'Galicia',
    Madrid = 'Madrid',
    NavarraYAragon = 'NavarraYAragon',
    Valencia = 'Valencia',
    Sugerencias = 'Sugerencias',
}

registerEnumType(MailerSettingsEnum, {
    name: 'MailerSettings'
})
