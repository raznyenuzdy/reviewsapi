import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from './review.model';

@Injectable()
export class ReviewService {
    constructor(@InjectModel(ReviewModel) private userRepository: typeof ReviewModel,
        private configService: ConfigService,
    ) {

    }
}
