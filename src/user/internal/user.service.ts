import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../repository/user.repository';
import {
  IInternalUserService,
  CreateUserOptions,
  CreateUserResult,
  LoginUserOptions,
  LoginUserResult,
  FindByIdResult,
} from './interface/user-service.interface';
import { UserRole } from '../../common/enum/common.enum';
import { ERROR_CODE } from '../../common/exception/error-code';
import { AccessTokenPayload } from '../../common/interface/common.interface';

@Injectable()
export class InternalUserService implements IInternalUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 사용자 생성
   * @throws {ConflictException} [USER00001] 이미 사용중인 이메일
   * @throws {InternalServerErrorException} [USER00002] 사용자 생성 실패
   */
  async create(user: CreateUserOptions): Promise<CreateUserResult> {
    // 이메일 중복 체크
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException(ERROR_CODE.DUPLICATE_EMAIL);
    }

    // 비밀번호 암호화 (bcrypt)
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // 사용자 생성
    const { id } = await this.userRepository.create({ ...user, password: hashedPassword, role: UserRole.USER });

    return { id };
  }

  /**
   * 사용자 로그인
   * TODO: 리프레시 토큰 발행 필요
   *
   * @throws {UnauthorizedException} [USER00003] 이메일 또는 비밀번호가 올바르지 않습니다.
   */
  async login(user: LoginUserOptions): Promise<LoginUserResult> {
    // 사용자 조회
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException(ERROR_CODE.INVALID_CREDENTIALS);
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_CODE.INVALID_CREDENTIALS);
    }

    // 액세스 토큰 발행
    const payload: AccessTokenPayload = {
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * 사용자 조회
   * @throws {NotFoundException} [USER00004] 사용자를 찾을 수 없습니다.
   */
  async findById(id: string): Promise<FindByIdResult> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(ERROR_CODE.USER_NOT_FOUND);
    }

    return user;
  }
}
