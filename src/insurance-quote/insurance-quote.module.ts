import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// 🗃️ Entidades
import { InsuranceQuote } from './entities/insurance-quote.entity'
import { InsuranceProposal } from './entities/insurance-proposal.entity'
import { Client } from '../clients/entities/client.entity'
import { Producer } from '../producers/entities/producer.entity'
import { User } from '../users/entities/user.entity'

// ⚙️ Serviços
import { InsuranceQuoteService } from './services/insurance-quote.service'
import { InsuranceProposalService } from './services/insurance-proposal.service'
import { GoogleVisionService } from './services/google-vision.service'
import { OpenAiService } from './services/openai.service'

// 🎮 Controllers
import { InsuranceQuoteController } from './controllers/insurance-quote.controller'
import { InsuranceProposalController } from './controllers/insurance-proposal.controller'
import { UploadProposalController } from './controllers/upload-proposal.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InsuranceQuote,
      InsuranceProposal,
      Client,
      Producer,
      User,
    ]),
  ],
  controllers: [
    InsuranceQuoteController,
    InsuranceProposalController,
    UploadProposalController,
  ],
  providers: [
    InsuranceQuoteService,
    InsuranceProposalService,
    GoogleVisionService,
    OpenAiService, // ✅ IA integrada
  ],
})
export class InsuranceQuoteModule {}
