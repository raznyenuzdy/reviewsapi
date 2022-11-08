import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ReviewModel } from './review.model';
import {  } from './review.service';

@Controller('review')
export class ReviewController {

    @Post('')
    async create(@Body() dto: Omit<ReviewModel, '_id'>) {

    }

    @Get('forBlock/:block_id')
    async get(@Param('block_id') block_id: string) {

    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() dto: string) {

    }

    @Delete(':id')
    async delete(@Param('id') id: string) {

    }
}
