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
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Registra um novo usuário.
   */
  async register(registerDto: RegisterDto) {
    console.log(`🔍 Tentando registrar o usuário: ${registerDto.email}`);

    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      console.log('❌ E-mail já cadastrado.');
      throw new ConflictException('E-mail já cadastrado.');
    }

    const newUser = await this.usersService.create(registerDto);
    console.log(`✅ Usuário ${newUser.email} registrado com sucesso.`);
    return newUser;
  }

  /**
   * Valida o usuário durante o login.
   */
  async validateUser(email: string, password: string) {
    console.log(`🔍 Buscando usuário com email: ${email}`);
    
    const user = await this.usersService.findByEmail(email, true); // Carrega a senha para validação

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

  /**
   * Gera o token JWT e Refresh Token ao logar.
   */
  async login(user: User) {
    console.log(`🔐 Gerando tokens para o usuário: ${user.email}`);

    const payload = { id: user.id, email: user.email, role: user.role?.name };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user);

    console.log('✅ Tokens gerados com sucesso.');

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role?.name,
    };
  }

  /**
   * Gera um novo Refresh Token e salva no banco.
   */
  async generateRefreshToken(user: User) {
    console.log(`🔄 Criando Refresh Token para o usuário ID: ${user.id}`);

    const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      user: user, // Passa o objeto User corretamente
      expiresAt,
    });

    console.log(`🛠 Salvando Refresh Token no banco para user_id: ${user.id}`);

    await this.refreshTokenRepository.save(refreshToken);

    console.log('✅Refresh Token salvo no banco.');
    return token;
  }

  /**
   * Valida e renova o Refresh Token.
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    console.log(`🔄 Tentando validar Refresh Token: ${refreshTokenDto.refreshToken}`);

    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refreshToken },
      relations: ['user'], // Certifica-se de carregar o usuário relacionado
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      console.log('❌ Token inválido ou expirado.');
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    console.log('✅ Refresh Token válido. Gerando novo Access Token.');
    return this.login(storedToken.user);
  }
}
