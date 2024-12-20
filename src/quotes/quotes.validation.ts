import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

export const ValidateFetchQuotesQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const count = parseInt(query.count, 10);
    console.log('count', query.count)
    if (isNaN(count) || count < 1 || count > 25) {
      throw new BadRequestException(
        'Invalid "count" parameter: must be an integer between 1 and 25.',
      );
    }

    const filter = query.filter ? String(query.filter) : undefined;
    return { count, filter };
  },
);
