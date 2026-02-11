import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from '@/ai/application/ai.service';
import { ChatRequest } from '@/ai/presentation/request/chat.request';
import { ChatResponse } from '@/ai/presentation/response/chat.response';
import { UserRole } from '@/user/domain/user-role.enum';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('chat')
  @Roles(UserRole.ADMIN)
  async chat(@Body() request: ChatRequest): Promise<ChatResponse> {
    const reply = await this.aiService.chat(request.message);
    return new ChatResponse(reply);
  }
}
