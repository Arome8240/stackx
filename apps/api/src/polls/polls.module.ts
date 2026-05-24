import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Poll, PollSchema } from './schemas/poll.schema';
import { PollVote, PollVoteSchema } from './schemas/poll-vote.schema';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Poll.name, schema: PollSchema },
      { name: PollVote.name, schema: PollVoteSchema },
    ]),
  ],
  providers: [PollsService],
  controllers: [PollsController],
  exports: [PollsService],
})
export class PollsModule {}
