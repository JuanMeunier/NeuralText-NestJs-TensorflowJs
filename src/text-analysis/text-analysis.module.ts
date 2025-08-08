import { Module } from '@nestjs/common';
import { TextAnalysisController } from './controllers/textAnalyze.controller';
import { TextAnalysisService } from './services/textAnalize.service';

@Module({
    imports: [],
    controllers: [TextAnalysisController],
    providers: [TextAnalysisService],
})
export class TextAnalysisModule { }