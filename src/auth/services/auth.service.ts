import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsersService } from '../../users/services/users.service'
import { RegisterDto } from '../dto/register.dto'
import { RefreshTokenDto } from '../dto/refresh-token.dto'
import { User } from '../../users/entities/user.entity'
import { RefreshToken } from '../entities/refresh-token.entity'
import { Role } from '../../roles/entities/role.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email)
    if (existing) {
      throw new ConflictException('E-mail já cadastrado.')
    }

    const role = await this.roleRepo.findOne({ where: { id: registerDto.roleId } })
    if (!role) throw new NotFoundException('Role não encontrada.')

    const { roleId, ...rest } = registerDto

    const newUser = await this.usersService.create({
      ...rest,
      role,
    } as any)

    return newUser
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email, true)
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciais inválidas.')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new UnauthorizedException('Credenciais inválidas.')
    }

    return user
  }

  async login(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.name,
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = await this.generateRefreshToken(user)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: {
          id: user.role?.id,
          name: user.role?.name,
        },
      },
    }
  }

  async generateRefreshToken(user: User): Promise<string> {
    const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '7d' })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const tokenHash = await bcrypt.hash(token, 10)

    const refreshToken = this.refreshTokenRepo.create({
      token,
      tokenHash,
      user,
      expiresAt,
    })

    await this.refreshTokenRepo.save(refreshToken)
    return token
  }

  async refreshToken(dto: RefreshTokenDto) {
    const storedTokens = await this.refreshTokenRepo.find({ relations: ['user'] })

    const matching = await Promise.any(
      storedTokens.map(async (entry) => {
        const match = await bcrypt.compare(dto.refreshToken, entry.tokenHash)
        return match ? entry : null
      }),
    ).catch(() => null)

    if (!matching || matching.expiresAt < new Date()) {
      throw new UnauthorizedException('Token inválido ou expirado.')
    }

    return this.login(matching.user)
  }
}
