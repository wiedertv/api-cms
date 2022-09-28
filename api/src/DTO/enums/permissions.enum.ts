import {registerEnumType} from '@nestjs/graphql';

export enum PermissionsEnum {
    news= 'news',
    events = 'events',
    scheduleAppointment = 'scheduleAppointment',
    entries = 'entries'
}
registerEnumType(PermissionsEnum, {
    name: 'Permissions',
});
