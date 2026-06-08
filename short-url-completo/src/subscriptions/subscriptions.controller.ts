import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}
  @Get('plans')
  getPlans() {
    return this.subscriptionsService.getPlans();
  }
  @Post('plans')
  createPlan(@Body() dto: CreatePlanDto) {
    return this.subscriptionsService.createPlan(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  subscribe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.subscribe(user.sub, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me/active')
  getActive(@CurrentUser() user: JwtPayload) {
    return this.subscriptionsService.getActiveSubscription(user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMySubs(@CurrentUser() user: JwtPayload) {
    return this.subscriptionsService.getUserSubscriptions(user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subscriptionsService.cancel(user.sub, id);
  }
}
