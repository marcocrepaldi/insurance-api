import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { User } from '../../users/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Role } from '../../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const role = await this.rolesRepository.findOne({
      where: { id: registerDto.roleId },
    });

    if (!role) {
      throw new NotFoundException('Role não encontrada.');
    }

    const { roleId, ...userData } = registerDto;

    const newUser = await this.usersService.create({
      ...userData,
      role,
    } as any);

    return newUser;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email, true);
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return user;
  }

  async login(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role?.name };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role?.name,
    };
  }

  async generateRefreshToken(user: User) {
    const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const tokenHash = await bcrypt.hash(token, 10);

    const refreshToken = this.refreshTokenRepository.create({
      token, // opcional
      tokenHash,
      user,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);
    return token;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const storedTokens = await this.refreshTokenRepository.find({
      relations: ['user'],
    });

    const matchingToken = await Promise.any(
      storedTokens.map(async (stored) => {
        const match = await bcrypt.compare(
          refreshTokenDto.refreshToken,
          stored.tokenHash,
        );
        return match ? stored : null;
      }),
    ).catch(() => null);

    if (!matchingToken || matchingToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    return this.login(matchingToken.user);
  }
}
