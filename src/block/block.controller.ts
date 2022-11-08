import { Body, Controller, Delete, Get, HttpStatus, InternalServerErrorException, Logger, Param, Patch, Post, Put, UnauthorizedException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiOperation, ApiProduces, ApiResponse, ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AppLogger } from 'src/logger/logger.service';
import { Block } from './block.model';
import { BlockService } from './block.service';
import { BlockDto } from './dto/blockDto';
import { JWT, Member, UserData } from './block.decorator';
import { UserDto, BadRequest } from 'src/user/dto/user.dto';
import { BlockAdminAttributes, IBlockAdminAttributes } from 'src/all.interface';

@Controller('block')
export class BlockController {

    constructor(private blockService: BlockService, private log: AppLogger) { }

    @ApiOperation({ summary: "Add top level text block" })
    @ApiCreatedResponse({ description: "Add new Ad|Review", type: BlockDto })
    @ApiUnauthorizedResponse({ description: "Member not authorized. Code: U###", status: HttpStatus.UNAUTHORIZED })
    @ApiBadRequestResponse({ description: "Bad request", type: BlockDto })
    @ApiInternalServerErrorResponse({
        description: "Internal server error. Code: I1##",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        schema: {
            example: {
                "name":"InternalServerErrorException",
                "message":"Internal server error. Code: I101",
                "statusCode":500,
                "timestamp":"2022-10-01T13:42:04.187Z",
                "path":"/api/user/auth0|****22065d9f46****cdaf20"
            }}
        })
    @ApiBearerAuth("Authorization")
    @ApiSecurity("bearerAuth")
    @ApiBody({
        type: BlockDto,
        description: 'Create user request',
    })
    @ApiProduces("application/json")
    @ApiResponse({ description: 'Create new information block, ad, review etc', status: HttpStatus.CREATED, type: Block })
    @Post()
    async create(@UserData() userData: UserDto, @Body() dto: Omit<Block, 'id'>) {
        if (!userData) {
            Logger.error(`Member not authorized. Code: U101: userData or Member not provided: ${userData}, ${Member}`);
            throw new UnauthorizedException('Member not authorized. Code: U101');
        }
        if (!dto) {
            throw new BadRequest();
        }
        try {
            dto.ref_user = userData.id;
            dto.user_model = JSON.stringify(userData);
            return await this.blockService.createBlock(dto);
        } catch (error) {
            console.log(error);
            Logger.error(error);
            throw new InternalServerErrorException('Internal server error. Code: I101');
        }
    }

    @Patch('/admin/:id')
    async update(@UserData() userData: UserDto, @Param('id') id: number, @Body() dto: BlockAdminAttributes) {
        if (!userData) {
            Logger.error(`Member not authorized. Code: U10*2: userData or Member not provided: ${userData}, ${Member}`);
            throw new UnauthorizedException('Member not authorized. Code: U10*2');
        }
        //user or member
        if (!dto) {
            throw new BadRequest();
        }
        try {
            if (['admin', 'moder'].find(v => v === userData.role)) {
                return await this.blockService.updateBlockAdmin(id, dto);
            } else {
                throw new UnauthorizedException('Member not authorized. Code: U10*1');
            }
            //owner
            // if (['user', 'org'].find(v => v === userData.role)) {
            // }
        } catch (error) {
            console.log(error);
            Logger.error(error);
            throw new InternalServerErrorException('Internal server error. Code: I101');
        }
    }

    //количество загружаемых блоков
    @Get('/:page')
    async getPerLimit(@Param('page') page: string) {
        return await this.blockService.getBlocks(page);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {

    }

}
