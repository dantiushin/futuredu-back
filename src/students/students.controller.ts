import {
  Controller,
  Get,
  HttpService,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { StudentsService } from './students.service';

@Controller('api/v1')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private httpService: HttpService,
  ) {}

  @Get('/student/info')
  getInfo(@Query('mail') mail: string, @Res() response: Response) {
    const headersRequest = {
      Authorization: 'Basic cHJvamVjdG9mZmljZTpxOTBoNWp1NA==',
    };
    this.httpService
      .get('http://api.sync.ictis.sfedu.ru/find/student/email', {
        params: {
          email: mail,
        },
        headers: headersRequest,
      })
      .subscribe(
        (information) => response.status(HttpStatus.OK).json(information.data),
        (err) => response.status(HttpStatus.BAD_REQUEST).json(err),
      );
  }

  @Get('schedule')
  getSchedule(@Query('payload') data: string, @Res() response: Response) {
    this.httpService
      .get('http://ictis.sfedu.ru/schedule-api/', {
        params: { query: data },
      })
      .subscribe(
        (res) => response.status(HttpStatus.OK).json(res.data),
        (err) => response.status(HttpStatus.BAD_REQUEST).json(err),
      );
  }

  @Get('schedule/:id')
  getCurrentSchedule(@Query('payload') data: string, @Res() response: Response) {
    const deserializeData = JSON.parse(data);
    this.httpService
      .get('http://ictis.sfedu.ru/schedule-api/', {
        params: {
          group: deserializeData.group,
          week: deserializeData.page,
        },
      })
      .subscribe(
        (res) => response.status(HttpStatus.OK).json(res.data),
        (err) => response.status(HttpStatus.BAD_REQUEST).json(err),
      );
  }
}
