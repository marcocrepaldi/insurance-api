import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Patch,
    Delete,
    Req,
  } from '@nestjs/common'
  import { Request } from 'express'
  import { ProposalLogsService } from '../services/proposal-logs.service'
  import { CreateProposalLogDto } from '../dto/create-proposal-log.dto'
  import { UpdateProposalLogDto } from '../dto/update-proposal-log.dto'
  
  @Controller('proposal-logs')
  export class ProposalLogsController {
    constructor(private readonly service: ProposalLogsService) {}
  
    @Post()
    create(@Body() dto: CreateProposalLogDto, @Req() req: Request) {
      const userId = req.user?.id
      return this.service.create(dto, userId)
    }
  
    @Get('proposal/:proposalId')
    findAllByProposal(@Param('proposalId') proposalId: string) {
      return this.service.findAllByProposal(proposalId)
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProposalLogDto) {
      return this.service.update(id, dto)
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(id)
    }
  }
  