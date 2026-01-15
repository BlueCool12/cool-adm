import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '@/user/application/user.service';
import { CreateUserRequest } from '@/user/presentation/request/create-user.request';
import { CreateUserCommand } from '@/user/application/command/create-user.command';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/presentation/guards/roles.guard';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';
import { UserRole } from '@/user/domain/user-role.enum';
import { GetUsersRequest } from '@/user/presentation/request/get-users-request';
import { GetUsersQuery } from '@/user/application/query/get-users.query';
import { GetUsersResponse } from '@/user/presentation/response/get-users.response';
import { UpdateUserRequest } from '@/user/presentation/request/update-user.request';
import { UpdateUserCommand } from '@/user/application/command/update-user.command';

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

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() request: UpdateUserRequest): Promise<void> {
    const command = new UpdateUserCommand(
      id,
      request.name,
      request.nickname,
      request.role,
      request.password,
    );

    await this.userService.update(command);
  }
}
