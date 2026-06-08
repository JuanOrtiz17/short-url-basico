import { Controller, Get, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyPayments(@CurrentUser() user: JwtPayload) {
    return this.paymentsService.getMyPayments(user.sub);
  }
}
