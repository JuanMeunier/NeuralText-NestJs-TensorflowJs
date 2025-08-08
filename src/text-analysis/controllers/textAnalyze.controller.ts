// src/text-analysis/controllers/text-analysis.controller.ts
import { Controller, Post, Get, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TextAnalysisService } from '../services/textAnalize.service';
import { AnalyzeTextDto } from '../dtos/text.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Text Analysis')
@Controller('text')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TextAnalysisController {
    constructor(private readonly textAnalysisService: TextAnalysisService) { }

    @Post('analyze')
    @ApiOperation({
        summary: 'Análisis completo de texto con IA',
        description: 'Analiza texto usando 4 modelos de IA especializados: sentimientos, emociones, entidades nombradas e intenciones del usuario'
    })
    @ApiResponse({
        status: 200,
        description: 'Análisis completado exitosamente',
        example: {
            text: "Estoy muy feliz trabajando con Microsoft y mi colega Juan en Buenos Aires",
            analysis: {
                sentiment: {
                    label: "POSITIVE",
                    score: 0.95
                },
                emotion: {
                    label: "joy",
                    score: 0.87
                },
                entities: [
                    { entity: "ORG", word: "Microsoft", start: 29, end: 38, score: 0.99 },
                    { entity: "PERSON", word: "Juan", start: 52, end: 56, score: 0.95 },
                    { entity: "LOC", word: "Buenos Aires", start: 60, end: 72, score: 0.98 }
                ],
                intent: {
                    label: "statement",
                    score: 0.89
                }
            },
            timestamp: "2024-01-15T10:30:00.000Z"
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Texto inválido o vacío'
    })
    @ApiResponse({
        status: 503,
        description: 'Modelos de IA aún cargando'
    })
    async analyzeText(@Body() analyzeTextDto: AnalyzeTextDto) {
        try {
            return await this.textAnalysisService.analyzeComplete(analyzeTextDto.text);
        } catch (error) {
            if (error.message.includes('still loading')) {
                throw new HttpException(
                    'AI models are still loading. Please wait a few minutes and try again.',
                    HttpStatus.SERVICE_UNAVAILABLE
                );
            }
            throw new HttpException(
                `Analysis failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('analyze/sentiment')
    @ApiOperation({
        summary: 'Análisis solo de sentimientos',
        description: 'Analiza únicamente el sentimiento del texto (positivo, negativo, neutro)'
    })
    @ApiResponse({
        status: 200,
        description: 'Análisis de sentimiento completado',
        example: {
            label: "POSITIVE",
            score: 0.95
        }
    })
    async analyzeSentiment(@Body() analyzeTextDto: AnalyzeTextDto) {
        try {
            return await this.textAnalysisService.analyzeSentiment(analyzeTextDto.text);
        } catch (error) {
            throw new HttpException(
                `Sentiment analysis failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('analyze/entities')
    @ApiOperation({
        summary: 'Extracción de entidades nombradas',
        description: 'Extrae personas, lugares, organizaciones y otras entidades del texto'
    })
    @ApiResponse({
        status: 200,
        description: 'Extracción de entidades completada',
        example: [
            { entity: "PERSON", word: "Juan", start: 0, end: 4, score: 0.99 },
            { entity: "ORG", word: "Google", start: 18, end: 24, score: 0.95 }
        ]
    })
    async extractEntities(@Body() analyzeTextDto: AnalyzeTextDto) {
        try {
            return await this.textAnalysisService.extractEntities(analyzeTextDto.text);
        } catch (error) {
            throw new HttpException(
                `Entity extraction failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('analyze/emotion')
    @ApiOperation({
        summary: 'Análisis de emociones',
        description: 'Detecta emociones específicas: alegría, tristeza, ira, miedo, sorpresa, etc.'
    })
    @ApiResponse({
        status: 200,
        description: 'Análisis de emociones completado',
        example: {
            label: "joy",
            score: 0.87
        }
    })
    async analyzeEmotion(@Body() analyzeTextDto: AnalyzeTextDto) {
        try {
            return await this.textAnalysisService.analyzeEmotion(analyzeTextDto.text);
        } catch (error) {
            throw new HttpException(
                `Emotion analysis failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('analyze/intent')
    @ApiOperation({
        summary: 'Clasificación de intención',
        description: 'Clasifica la intención del usuario: pregunta, solicitud, queja, elogio, etc.'
    })
    @ApiResponse({
        status: 200,
        description: 'Clasificación de intención completada',
        example: {
            label: "question",
            score: 0.92
        }
    })
    async classifyIntent(@Body() analyzeTextDto: AnalyzeTextDto) {
        try {
            return await this.textAnalysisService.classifyIntent(analyzeTextDto.text);
        } catch (error) {
            throw new HttpException(
                `Intent classification failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('models/status')
    @ApiOperation({
        summary: 'Estado de los modelos de IA',
        description: 'Verifica si todos los modelos están cargados y listos para usar'
    })
    @ApiResponse({
        status: 200,
        description: 'Estado de modelos obtenido',
        example: {
            modelsLoaded: true,
            models: {
                sentiment: true,
                ner: true,
                emotion: true,
                intent: true
            },
            loadedAt: "2024-01-15T10:25:00.000Z"
        }
    })
    async getModelsStatus() {
        return await this.textAnalysisService.getModelsStatus();
    }

    @Get('service/info')
    @ApiOperation({
        summary: 'Información técnica del servicio',
        description: 'Detalles de los modelos de IA disponibles y su configuración'
    })
    @ApiResponse({
        status: 200,
        description: 'Información del servicio obtenida',
        example: {
            availableModels: ["SENTIMENT", "NER", "EMOTION", "INTENT"],
            modelDetails: {
                SENTIMENT: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
                NER: "Xenova/bert-base-NER",
                EMOTION: "Xenova/j-hartmann-emotion-english-distilroberta-base",
                INTENT: "Xenova/microsoft-DialoGPT-medium"
            },
            status: {
                modelsLoaded: true,
                models: {
                    sentiment: true,
                    ner: true,
                    emotion: true,
                    intent: true
                }
            }
        }
    })
    async getServiceInfo() {
        return await this.textAnalysisService.getServiceInfo();
    }
}