import { registerEnumType } from '@nestjs/graphql';

export enum IdentifierTypeEnum {
  passport = 'Pasaporte',
  dniNif = 'DNI/NIF',
  nie = 'NIE',
}

registerEnumType(IdentifierTypeEnum, {
  name: 'IdentifierTypes',
});
