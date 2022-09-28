import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateHallDto {
    @Field()
    @ApiProperty()
    @IsString()
    serialNumber: string;

    @Field()
    @ApiProperty()
    @IsString()
    date: string;

    @Field()
    @ApiProperty()
    @IsString()
    hour: string;

    @Field()
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    activity: string;
}
