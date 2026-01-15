import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../application/user.service';
import { CreateUserRequest } from './request/create-user.request';
import { CreateUserCommand } from '../application/command/create-user.command';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/presentation/guards/roles.guard';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';
import { UserRole } from '../domain/user-role.enum';
import { GetUsersRequest } from './request/get-users-request';
import { GetUsersQuery } from '../application/query/get-users.query';
import { GetUsersResponse } from './response/get-users.response';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreateUserRequest): Promise<void> {
    const command = new CreateUserCommand(
      request.loginId,
      request.password,
      request.name,
      request.nickname,
      request.role,
    );

    await this.userService.create(command);
  }

  @Get()
  async findAll(@Query() request: GetUsersRequest): Promise<GetUsersResponse> {
    const query = new GetUsersQuery(request.page, request.limit, request.role, request.search);
    const result = await this.userService.findAll(query);
    return GetUsersResponse.fromResult(result);
  }
}
