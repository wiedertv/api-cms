import {Field, InputType, Int, ObjectType} from '@nestjs/graphql';


@InputType()
export class IAllowed{
    @Field()
    miembro: boolean;
    @Field()
    voluntario: boolean;
    @Field()
    empleado: boolean;
    @Field()
    beneficiario: boolean;
    @Field()
    amigo: boolean;
    @Field()
    contactoInteres: boolean;
}
@ObjectType()
export class Allowed{
    @Field()
    miembro: boolean;
    @Field()
    voluntario: boolean;
    @Field()
    empleado: boolean;
    @Field()
    beneficiario: boolean;
    @Field()
    amigo: boolean;
    @Field()
    contactoInteres: boolean;
}

@InputType()
export class PermissionsInputDto{
    @Field(()=>Int)
    id?: number;
    @Field()
    name: string;
    @Field()
    allowed: IAllowed;
}

@ObjectType()
export class PermissionsDto {
    @Field(()=>Int)
    id?: number;
    @Field()
    name: string;
    @Field()
    allowed: Allowed;
}

