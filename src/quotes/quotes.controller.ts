import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { parseErrorMessage } from 'src/utils/parseErrorMessageUtils';
import { ValidateFetchQuotesQuery } from './quotes.validation';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get('getRandomQuotes')
  async getQuotes(
    @ValidateFetchQuotesQuery() query: { count: number; filter?: string },
  ) {
    try {
      return await this.quotesService.fetchQuotes(query.count, query.filter);
    } catch (error) {
      const errorMessage = parseErrorMessage(error, 'Failed to fetch quotes:');
      console.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
