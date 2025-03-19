import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    return await this.usersService.create(registerDto);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email, true); // Agora carrega a senha

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return user;
  }

  async login(user: any) {
    // Agora login recebe um usuário validado
    const payload = { id: user.id, email: user.email, role: user.role?.name };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role?.name,
    };
  }

  async generateRefreshToken(userId: string) {
    const token = this.jwtService.sign({ userId }, { expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      user: { id: userId },
      expiresAt,
    });
    await this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    return this.login(storedToken.user); // Agora passamos o usuário validado
  }
}
