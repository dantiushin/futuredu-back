import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/oauth2/authorization/azure')
  redirectToAzure(@Param('login_hint') login_hint: string, @Res() response: Response) {
    return response.redirect(
      `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/authorize` +
        `?client_id=${process.env.CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${process.env.FRONT_END_URI}` +
        `&response_mode=query` +
        `&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fuser.read` +
        `&state=12345` +
        `&login_hint=${login_hint}`,
    );
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
