import {
  Controller,
  HttpService,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request, Response } from 'express';

@Controller('api/v1')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private httpService: HttpService,
  ) {}

  @Get('/oauth2/authorization/azure')
  redirectToAzure(
    @Query('login_hint') login_hint: string,
    @Res() response: Response,
  ) {
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

  @Post('/auth/azure-oauth2/tokens')
  getTokens(
    @Req() request: Request,
    @Body('code') code: string,
    @Res() response: Response,
  ) {
    const data = decodeURIComponent(
      `client_id=${process.env.CLIENT_ID}` +
        `&scope=https://graph.microsoft.com/user.read` +
        `&redirect_uri=http://localhost:3000` +
        `&grant_type=authorization_code` +
        `&client_secret=${process.env.CLIENT_SECRETS_VALUE}` +
        `&code=${code}`,
    );
    const headersRequest = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.httpService
      .post(
        `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
        data,
        { headers: headersRequest },
      )
      .subscribe(
        (tokens) => response.status(HttpStatus.OK).json(tokens.data),
        (err) => response.status(HttpStatus.BAD_REQUEST).json(err),
      );
  }

  @Post('/auth/azure-oauth2/user')
  getUser(
    @Req() request: Request,
    @Body() credential: any,
    @Res() response: Response,
  ) {
    const headersRequest = {
      Authorization: `Bearer ${credential.access_token}`,
    };
    this.httpService
      .get(`https://graph.microsoft.com/v1.0/me/`, { headers: headersRequest })
      .subscribe(
        (tokens) => response.status(HttpStatus.OK).json(tokens.data),
        (err) => response.status(HttpStatus.BAD_REQUEST).json(err),
      );
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
