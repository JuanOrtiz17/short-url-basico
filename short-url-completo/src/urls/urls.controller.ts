import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Redirect,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
@Controller('url')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  createUrl(@CurrentUser() user: JwtPayload, @Body() dto: CreateUrlDto) {
    return this.urlsService.createUrl(user.sub, dto);
  }
  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string, @Req() req: Request) {
    const url = await this.urlsService.findByShortCode(shortCode, req);
    return { url: url.originalUrl, statusCode: 302 };
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  getMyUrls(@CurrentUser() user: JwtPayload) {
    return this.urlsService.getMyUrls(user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  getStats(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.urlsService.getUrlStats(user.sub, id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  deactivate(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.urlsService.deactivate(user.sub, id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  activate(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.urlsService.activate(user.sub, id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUrl(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.urlsService.deleteUrl(user.sub, id);
  }
}
