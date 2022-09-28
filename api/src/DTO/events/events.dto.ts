import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LocationsEntity } from '../../database/entities/locations.entity'
import { Upload } from '../scalars/upload.scalar'

@InputType()
export class ILocation {
  @ApiProperty()
  @Field(() => Int, { nullable: true })
  id: number;

  @ApiPropertyOptional()
  @Field({ nullable: true })
  street: string;

  @ApiPropertyOptional()
  @Field({ nullable: true })
  streetType: string;

  @ApiPropertyOptional()
  @Field({ nullable: true })
  zipCode: string;

  @ApiPropertyOptional()
  @Field({ nullable: true })
  province: string;

  @ApiPropertyOptional()
  @Field({ nullable: true })
  country: string;

  @ApiPropertyOptional()
  @Field({ nullable: true })
  number: string;

  @ApiPropertyOptional()
  @Field({ nullable: true })
  flat: string;

  @ApiPropertyOptional()
  @Field({ nullable: true })
  city: string;
}

@ObjectType()
export class EventsDto {
  @Field(() => Int)
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [String])
  delegation: string[];

  @Field()
  startHour: string;

  @Field()
  endHour: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field({ nullable: true })
  ticketPrice: number;

  @Field()
  location: LocationsEntity;

  @Field()
  image: string;

  @Field()
  imageName: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  allowed: string[];

  @Field({ nullable: true })
  buyTicketsLink: string;

  @Field()
  releaseDate: string;

  @Field()
  released: boolean;
}

@InputType()
export class EventsInputDto {
  @Field(() => String)
  name: string;

  @Field(() => Upload, { nullable: true })
  image: any;

  @Field(() => String, { nullable: true })
  imageName: string;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  delegation: string[];

  @Field()
  startHour: string;

  @Field()
  endHour: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field({ nullable: true })
  ticketPrice: number;

  @Field()
  location: ILocation;

  @Field(() => [String])
  allowed: string[];

  @Field({ nullable: true })
  buyTicketsLink: string;

  @Field({ nullable: true })
  releaseDate: string;

  @Field({ defaultValue: false })
  released: boolean;
}

@ObjectType()
export class EventResponseDto {
  @Field()
  count: number;

  @Field()
  offset: number;

  @Field()
  limit: number;

  @Field(() => [String])
  order: string[];

  @Field(() => String)
  key: string;

  @Field(() => [EventsDto])
  data: EventsDto[];
}

@ObjectType()
export class DeleteEventDto {
  @Field(() => Int)
  id: number;
}
