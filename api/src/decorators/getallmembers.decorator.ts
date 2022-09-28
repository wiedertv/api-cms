
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import * as moment from 'moment'
import { FilterMemberDto } from '../DTO/members/getMember.dto'
@Injectable()
export class GetAllFilterPipe implements PipeTransform {
  transform (value: FilterMemberDto, metadata: ArgumentMetadata) {
    value.startDate = value.startDate ? moment.utc(value.startDate, 'YYYY-MM-DD').startOf('day').toISOString() : ''
    value.endDate = value.endDate ? moment.utc(value.endDate, 'YYYY-MM-DD').endOf('day').toISOString() : ''
    return value
  }
}
