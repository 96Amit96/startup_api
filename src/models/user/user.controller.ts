import { Body, Controller, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Param } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ==================== Get User Details By ID ======================= //

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @Get(':id')
  async getById(@Param('id') id: any): Promise<User> {
    return await this.userService.getById(id);
  }

  // ==================== check user isEligible (18 +) =================== //

  @Put('is_eligible')
  async isEligible(@Body() dto: UserDto) {
    const user = await this.userService.isEligible(dto);
    return { user };
  }

  // ================================================================== //
}