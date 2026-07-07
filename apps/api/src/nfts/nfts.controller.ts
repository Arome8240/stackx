import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { NftsService } from './nfts.service';
import { MintNftDto } from './dto/mint-nft.dto';

@ApiTags('nfts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'nfts', version: '1' })
export class NftsController {
  constructor(private readonly nfts: NftsService) {}

  @Post('mint')
  @ApiOperation({ summary: 'Mint a cast as an NFT (signed and broadcast by the custodial wallet)' })
  mint(@CurrentUser() user: JwtPayload, @Body() dto: MintNftDto) {
    return this.nfts.mint(user.sub, dto.castId, dto.tokenUri, dto.maxEdition);
  }

  @Post(':tokenId/buy')
  @ApiOperation({ summary: 'Buy a listed NFT (signed and broadcast by the custodial wallet)' })
  buy(@CurrentUser() user: JwtPayload, @Param('tokenId', ParseIntPipe) tokenId: number) {
    return this.nfts.buy(user.sub, tokenId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all listed NFTs for marketplace' })
  getListings(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.nfts.getListings(page, limit);
  }

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Get NFT marketplace stats' })
  getStats() {
    return this.nfts.getStats();
  }

  @Get('me')
  @ApiOperation({ summary: "Get current user's NFTs" })
  getMyNfts(@CurrentUser() user: JwtPayload) {
    return this.nfts.getByOwner(user.sub);
  }

  @Get(':tokenId')
  @Public()
  @ApiOperation({ summary: 'Get NFT by token ID' })
  getOne(@Param('tokenId', ParseIntPipe) tokenId: number) {
    return this.nfts.getByTokenId(tokenId);
  }

  @Get('owner/:userId')
  @Public()
  @ApiOperation({ summary: "Get NFTs owned by a user" })
  getByOwner(@Param('userId') userId: string) {
    return this.nfts.getByOwner(userId);
  }
}
