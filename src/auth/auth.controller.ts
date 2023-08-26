import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/models/user/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ==================== User signup ======================= //

  @ApiOperation({ summary: 'User signup' })
  @ApiBody({ type: UserDto })
  @Public()
  @Post('/signup')
  async signUp(@Body() Body) {
    return await this.authService.signUp(Body);
  }

  // ==================== Send OTP to user email ================ //

  @ApiOperation({ summary: 'Send OTP (email) to user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
      },
      required: ['email'],
    },
  })
  @Public()
  @Post('/sendotp')
  async sendOtp(@Body() userDto: UserDto) {
    return await this.authService.sendOtp(userDto);
  }

  // ==================== verify otp and login user ======================= //

  @ApiOperation({ summary: 'User login via Email OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        otp: { type: 'string' },
      },
      required: ['email', 'otp'],
    },
  })
  @Public()
  @Post('/verify-otp-login')
  async verify(@Body() userDto: UserDto) {
    return await this.authService.verifyOtp(userDto);
  }

  // ==================== User login via Email Password ======================= //

  @ApiOperation({ summary: 'User login via Email Password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  @Public()
  @Post('/login')
  async login(@Body() userDto: UserDto) {
    return await this.authService.login(userDto);
  }

  // ==================== Google authentication - initiate ======================= //

  @Public()
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {}

  // ==================== SignIn With Google ======================= //

  @Public()
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any) {
    return await this.authService.googleSignin(req);
  }

  // ================================================================== //
}