import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AiService } from '@/ai/application/ai.service';
import { ChatRequest } from '@/ai/presentation/request/chat.request';
import { ChatResponse } from '@/ai/presentation/response/chat.response';
import { GetJobStatusResponse } from '@/ai/presentation/response/get-job-status.response';
import { UserRole } from '@/user/domain/user-role.enum';
import { Roles } from '@/auth/presentation/decorators/roles.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('chat')
  @Roles(UserRole.ADMIN)
  async chat(@Body() request: ChatRequest): Promise<ChatResponse> {
    const result = await this.aiService.chat(request.message);
    return ChatResponse.from(result);
  }

  @Get('jobs/:jobId')
  @Roles(UserRole.ADMIN)
  async getJobStatus(@Param('jobId') jobId: string): Promise<GetJobStatusResponse> {
    const task = await this.aiService.getJobStatus(jobId);
    return GetJobStatusResponse.from(task);
  }
}
