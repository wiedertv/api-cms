import { Field, InputType, Int } from '@nestjs/graphql';
import { Upload } from '../scalars/upload.scalar';
import { ILocation } from './events.dto';

@InputType()
export class UpdateEventsDto {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  name: string;
  @Field(() => Upload, { nullable: true })
  image: any;
  @Field(() => String, { nullable: true })
  imageName: string;
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => [String], { nullable: true })
  delegation: string[];
  @Field({ nullable: true })
  startHour: string;
  @Field({ nullable: true })
  endHour: string;
  @Field({ nullable: true })
  startDate: string;
  @Field({ nullable: true })
  endDate: string;
  @Field({ nullable: true })
  ticketPrice: number;
  @Field({ nullable: true })
  location: ILocation;
  @Field(() => [String])
  allowed: string[];
  @Field({ nullable: true })
  buyTicketsLink: string;
  @Field( {nullable: true})
  releaseDate: string;
  @Field({nullable:true})
  released: boolean;
}
