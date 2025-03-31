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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })

    if (!configService.get('JWT_SECRET')) {
      throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.')
    }
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Token inválido.')
    }

    return {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      role: {
        name: payload.role,
      },
    }
  }
}
