import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Redirect,
  ParseIntPipe,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller('url')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  createUrl(@Body() dto: CreateUrlDto) {
    return this.urlsService.createUrl(dto);
  }

  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string) {
    const url = await this.urlsService.findByShortCode(shortCode);
    return { url: url.originalUrl, statusCode: 302 };
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.urlsService.deactivate(id);
  }

  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.urlsService.activate(id);
  }
}
