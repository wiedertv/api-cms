import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import { RolesGuard } from '../auth/restapi-auth.guard'
import { Backup } from '../database/entities/backup.entity'
import { MemberFromController } from '../DTO/members/getMember.dto'
import { UpdateMemberFromControllerDto } from '../DTO/members/updateMember.dto'
import { MembersService } from './members.service'
import { PaginationQuery, PaginationQueryInterface } from './pagination.decorator'
import { Members } from '../database/entities/members.entity'
import { CreateHallDto } from '../DTO/hall/createHall.dto'
import { HallService } from '../hall/hall.service'
import { CreateMemberFromSugarDTO } from 'src/DTO/members/createMember.dto'

@ApiTags('Members')
@UseGuards(RolesGuard)
@Controller('members')
export class MembersController {
  constructor (private readonly membersService: MembersService,
               private readonly hallService: HallService) {}

  @Get()
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', required: true, description: '' })
  @ApiQuery({
    name: 'offset',
    description: 'Permite saltar el numero de inicio. si esta vacio comenzara desde 0',
    required: false,
    type: 'number'
  })
  @ApiQuery({
    name: 'limit',
    description: 'Permite Limitar cuantos va a devolver. si esta vacio traera 100 por defecto',
    required: false,
    type: 'number'
  })
  @ApiOperation({
    description: 'Obtiene toda la información de los miembros añadidos en la carga inicial, incluyendo el customID asignado a cada 1.'
  })
  getAllUsers (@PaginationQuery() query: PaginationQueryInterface): Promise<[Backup[], number]> {
    return this.membersService.getAllBackup(query.offset, query.limit)
  }

  @Post()
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', required: true, description: '' })
  @ApiOperation({
    description: 'Registra un usuario en la aplicacion'
  })
  @ApiBadRequestResponse({
    description: 'El correo del usuario o el identificador ya existen',
    status: 400
  })
  @ApiOkResponse(
    {
      description: 'devolvera el objeto del miembro creado en la aplicacion en conjunto con el CustomID necesario para realizar modificaciones futuras',
      type: Members
    })
  createMember (@Body() body: CreateMemberFromSugarDTO) {
    return this.membersService.createMemberFromSugar(body)
  }

  @Get(':memberId')
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', required: true, description: '' })
  @ApiParam({
    name: 'memberId',
    description: 'Member customID',
    required: true
  })
  @ApiOperation({
    description: 'Obtiene toda la información de un miembro de la orden usando el CustomID de dicho miembro'
  })
  @ApiOkResponse({
    type: MemberFromController
  })
  getUser (@Param('memberId') memberId: string) {
    return this.membersService.getOneFromController(memberId)
  }

  @Post('hall')
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', required: true, description: '' })
  @ApiBody({
    required: true,
    type: CreateHallDto
  })
  signMemberIntoHall (@Body() body:CreateHallDto) {
    return this.hallService.create(body)
  }

  @Patch(':memberId')
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', required: true, description: '' })
  @ApiParam({
    name: 'memberId',
    description: 'Member customID - es un UUID',
    required: true
  })
  @ApiOperation({
    description: 'Actualiza la información de un miembro de la orden usando el  customID de dicho miembro'
  })
  @ApiOkResponse({
    type: Members
  })
  updateUser (@Param('memberId') memberId: string, @Body() body: UpdateMemberFromControllerDto): Promise<Members | Backup> {
    return this.membersService.updateFromController(memberId, body)
  }

  @Delete(':memberId')
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', required: true, description: '' })
  @HttpCode(204)
  @ApiParam({
    name: 'memberId',
    description: 'Member customID',
    required: true
  })
  @ApiOperation({
    description: 'Elimina un miembro de la orden usando el customID de dicho miembro'
  })
  @ApiNoContentResponse()
  deleteUser (@Param('memberId') memberId: string) {
    return this.membersService.delete(memberId)
  }
}
