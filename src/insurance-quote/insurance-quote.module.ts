// src/insurance-quote/insurance-quote.module.ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Entidades
import { InsuranceQuote } from './entities/insurance-quote.entity'
import { InsuranceProposal } from './entities/insurance-proposal.entity'
import { Client } from '../clients/entities/client.entity'
import { Producer } from '../producers/entities/producer.entity'

// Serviços
import { InsuranceQuoteService } from './services/insurance-quote.service'
import { InsuranceProposalService } from './services/insurance-proposal.service'
import { GoogleVisionService } from './services/google-vision.service'

// Controllers
import { InsuranceQuoteController } from './controllers/insurance-quote.controller'
import { UploadProposalController } from './controllers/upload-proposal.controller'
import { InsuranceProposalController } from './controllers/insurance-proposal.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InsuranceQuote,
      InsuranceProposal,
      Client,
      Producer,
    ]),
  ],
  controllers: [
    InsuranceQuoteController,
    UploadProposalController,
    InsuranceProposalController,
  ],
  providers: [
    InsuranceQuoteService,
    InsuranceProposalService,
    GoogleVisionService,
  ],
})
export class InsuranceQuoteModule {}
