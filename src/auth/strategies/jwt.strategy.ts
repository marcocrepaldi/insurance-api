import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

interface JwtPayload {
  userId: string
  email: string
  name: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    // Verifique se a chave JWT_SECRET está presente na configuração antes de inicializar a estratégia
    const jwtSecret = configService.get<string>('JWT_SECRET')
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.')
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    })
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.userId || !payload.role) {
      throw new UnauthorizedException('Token inválido ou malformado.')
    }

    return {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      role: {
        name: payload.role, // role como string, garantindo que seja retornada corretamente
      },
    }
  }
}
