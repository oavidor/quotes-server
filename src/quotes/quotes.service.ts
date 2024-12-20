import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quote } from './quotes.schema';
import axios from 'axios';
import { config } from 'src/config/config';
import { parseErrorMessage } from 'src/utils/parseErrorMessageUtils';
import { shuffleArray } from 'src/utils/arrayUtils';

@Injectable()
export class QuotesService {
  private readonly API_URL = config.fav_api_url;
  private readonly API_KEY = config.fav_api_key;

  constructor(@InjectModel(Quote.name) private quoteModel: Model<Quote>) {}

  /**
   * Fetch quotes from the external API or fallback to the database if rate limit is exceeded.
   * @param count Number of quotes to fetch
   * @param filter Optional filter to apply (e.g., by tag)
   * @returns A promise resolving to an array of quotes
   */
  async fetchQuotes(count: number, filter?: string): Promise<Quote[]> {
    try {
      const headers = {
        Authorization: `Token token="${this.API_KEY}"`,
      };

      const params = filter
        ? {
            filter,
            type: 'tag',
          }
        : {};

      const response = await axios.get(this.API_URL, { headers, params });

      const quotes = await this.handleResponse(response);
      await this.saveQuotes(quotes);

      return this.getRandomQuotes(quotes, count);
    } catch (error) {
      const errorMessage = parseErrorMessage(error, 'Error fetching quotes:');
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Handle the API response and determine whether to fetch from the database.
   * @param response The response object from the external API
   * @returns An array of quotes
   */
  private async handleResponse(response): Promise<Quote[]> {
    if (response.status === 200) {
      const rateLimitRemaining = parseInt(
        response.headers['rate-limit-remaining'],
        10,
      );

      if (rateLimitRemaining <= 0) {
        console.warn('Rate limit exceeded, fetching quotes from the database.');
        return this.quoteModel.find().exec();
      }

      if (response.data.error_code) {
        const errorMessage = parseErrorMessage(
          response.data,
          'Validation Error:',
        );
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (
        response.data.quotes?.length === 0 ||
        response.data.quotes[0]?.body === 'No quotes found'
      ) {
        console.warn('No quotes found in the API response.');
        throw new Error('No quotes found');
      }

      return response.data.quotes;
    }

    if (response.status === 404) {
      // in this status, if it is requested in the design we can also use fetch from db here
      console.error('Resource not found.');
      throw new Error('Status 404, Resource not found');
    }

    if (response.status === 500) {
      // in this status, if it is requested in the design we can also use fetch from db here
      console.error('Server error from the external API.');
      throw new Error('Status 500, Server error, please try again later');
    }

    throw new Error(`Unhandled response status: ${response.status}`);
  }

  /**
   * Save quotes to the database, ensuring no duplicates are stored.
   * @param quotes Array of quotes to save
   * @returns A boolean indicating if new quotes were added
   */
  private async saveQuotes(quotes: Quote[]): Promise<boolean> {
    try {
      const existingQuotes = await this.quoteModel
        .find({ id: { $in: quotes.map((q) => q.id) } })
        .exec();

      const existingIds = new Set(existingQuotes.map((quote) => quote.id));
      const newQuotes = quotes.filter((quote) => !existingIds.has(quote.id));

      if (newQuotes.length > 0) {
        await this.quoteModel.insertMany(newQuotes);
        return true;
      }

      return false;
    } catch (error) {
      const errorMessage = parseErrorMessage(error, 'Failed to save quotes:');
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get a random subset of quotes.
   * @param quotes Array of quotes to sample from
   * @param count Number of quotes to return
   * @returns An array of random quotes
   */
  private getRandomQuotes(quotes: Quote[], count: number): Quote[] {
    if (count <= 0) return [];
    if (count >= quotes.length) return [...quotes];
    return shuffleArray(quotes).slice(0, count);
  }
}
