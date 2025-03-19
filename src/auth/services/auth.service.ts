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
    console.log(`🔍 Buscando usuário com email: ${email}`);
    
    const user = await this.usersService.findByEmail(email, true); // Agora carrega a senha

    if (!user) {
      console.log('❌ Usuário não encontrado.');
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    console.log(`✅ Usuário encontrado: ${user.email}`);
    console.log(`🔑 Senha armazenada no banco: ${user.password}`);

    if (!user.password) {
      console.log('❌ Senha não encontrada no banco.');
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    console.log(`🔄 Comparando senha digitada: ${password}`);
    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('❌ Senha inválida.');
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    console.log('✅ Senha válida! Login autorizado.');

    return user;
  }

  async login(user: any) {
    console.log(`🔐 Gerando tokens para o usuário: ${user.email}`);

    const payload = { id: user.id, email: user.email, role: user.role?.name };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    console.log('✅ Tokens gerados com sucesso.');

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role?.name,
    };
  }

  async generateRefreshToken(userId: string) {
    console.log(`🔄 Criando Refresh Token para o usuário ID: ${userId}`);

    const token = this.jwtService.sign({ userId }, { expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      user: { id: userId },
      expiresAt,
    });
    await this.refreshTokenRepository.save(refreshToken);

    console.log('✅ Refresh Token salvo no banco.');

    return token;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    console.log(`🔄 Tentando validar Refresh Token: ${refreshTokenDto.refreshToken}`);

    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      console.log('❌ Token inválido ou expirado.');
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    console.log('✅ Refresh Token válido. Gerando novo Access Token.');
    return this.login(storedToken.user);
  }
}
