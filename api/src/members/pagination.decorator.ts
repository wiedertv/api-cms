import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export interface PaginationQueryInterface {
  limit: number;
  offset: number;
}

function validatePaginationParams (limit: string, offset: string): PaginationQueryInterface {
  limit = limit || '100'
  offset = offset || '0'

  const limitNumber = Number.parseInt(limit, 10)
  const offsetNumber = Number.parseInt(offset, 10)
  const errors = []

  if (limit && Number.isNaN(limitNumber)) {
    errors.push({
      value: limit,
      validation: 'limit parameter must be a number ',
      path: 'Limit'
    })
  }

  if (offset && Number.isNaN(offsetNumber)) {
    errors.push({
      value: offset,
      validation: 'offset parameter must be a number',
      path: 'Offset'
    })
  }

  if (errors.length) throw new BadRequestException(errors)

  return {
    limit: !Number.isNaN(limitNumber) && limitNumber,
    offset: !Number.isNaN(offsetNumber) && offsetNumber
  }
}

export const paginationQueryParamFactory = (_: void, ctx: ExecutionContext): PaginationQueryInterface => {
  const request: Request = ctx.switchToHttp().getRequest()
  const limit = (request.query?.limit as string) || ''
  const offset = (request.query?.offset as string) || ''

  return validatePaginationParams(limit, offset)
}

export const PaginationQuery = createParamDecorator(paginationQueryParamFactory)
