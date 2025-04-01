import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InsuranceQuote } from './entities/insurance-quote.entity'
import { InsuranceProposal } from './entities/insurance-proposal.entity'
import { Client } from '../clients/entities/client.entity'
import { Producer } from '../producers/entities/producer.entity'
import { InsuranceQuoteService } from './services/insurance-quote.service'
import { InsuranceProposalService } from './services/insurance-proposal.service'
import { GoogleVisionService } from './services/google-vision.service'
import { InsuranceQuoteController } from './controllers/insurance-quote.controller'
import { UploadProposalController } from './controllers/upload-proposal.controller'
import { InsuranceProposalController } from './controllers/insurance-proposal.controller' // ✅ ADICIONADO

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
    InsuranceProposalController, // ✅ REGISTRADO AQUI
  ],
  providers: [
    InsuranceQuoteService,
    InsuranceProposalService,
    GoogleVisionService,
  ],
})
export class InsuranceQuoteModule {}
