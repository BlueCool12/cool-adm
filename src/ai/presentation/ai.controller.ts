import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from '@/ai/application/ai.service';
import { ChatRequest } from '@/ai/presentation/request/chat.request';
import { ChatResponse } from '@/ai/presentation/response/chat.response';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/presentation/guards/roles.guard';
import { UserRole } from '@/user/domain/user-role.enum';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('chat')
  @Roles(UserRole.ADMIN)
  async chat(@Body() request: ChatRequest): Promise<ChatResponse> {
    const reply = await this.aiService.chat(request.message);
    return new ChatResponse(reply);
  }
}
