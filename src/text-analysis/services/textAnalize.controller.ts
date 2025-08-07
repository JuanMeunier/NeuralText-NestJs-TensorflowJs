import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ANALYSIS_MODELS } from 'src/common/models/models.constants';
import { AnalysisResponse, SentimentResult, EmotionResult, IntentResult, NamedEntity } from 'src/common/types/response.types';

@Injectable()
export class TextAnalysisService implements OnModuleInit {
    private readonly logger = new Logger(TextAnalysisService.name);

    // Pipelines de los 4 modelos
    private sentimentPipeline: any;
    private nerPipeline: any;
    private emotionPipeline: any;
    private intentPipeline: any;

    // Estado de carga de modelos
    private modelsLoaded = false;
    private modelStatus = {
        sentiment: false,
        ner: false,
        emotion: false,
        intent: false,
    };

    async onModuleInit() {
        this.logger.log('🤖 Iniciando carga de modelos de IA...');
        await this.loadModels();
    }

    private async loadModels() {
        try {
            const { pipeline } = await import('@xenova/transformers');

            this.logger.log('📥 Cargando modelos en paralelo...');

            // Cargar los 4 modelos en paralelo para mejor rendimiento
            const [sentiment, ner, emotion, intent] = await Promise.all([
                this.loadModel('sentiment-analysis', ANALYSIS_MODELS.SENTIMENT, 'sentiment'),
                this.loadModel('token-classification', ANALYSIS_MODELS.NER, 'ner'),
                this.loadModel('text-classification', ANALYSIS_MODELS.EMOTION, 'emotion'),
                this.loadModel('text-classification', ANALYSIS_MODELS.INTENT, 'intent'),
            ]);

            this.sentimentPipeline = sentiment;
            this.nerPipeline = ner;
            this.emotionPipeline = emotion;
            this.intentPipeline = intent;

            this.modelsLoaded = true;
            this.logger.log('Todos los modelos cargados exitosamente');

        } catch (error) {
            this.logger.error('Error cargando modelos:', error.message);
            throw new Error('Failed to load AI models');
        }
    }

    private async loadModel(task: string, modelName: string, type: string) {
        try {
            this.logger.log(`Cargando modelo ${type}: ${modelName}`);
            const { pipeline } = await import('@xenova/transformers');
            const model = await pipeline(task, modelName);
            this.modelStatus[type] = true;
            this.logger.log(` Modelo ${type} cargado`);
            return model;
        } catch (error) {
            this.logger.error(`Error cargando modelo ${type}:`, error.message);
            throw error;
        }
    }

    private ensureModelsLoaded() {
        if (!this.modelsLoaded) {
            throw new Error('Models are still loading. Please try again in a few moments.');
        }
    }

    // ANÁLISIS COMPLETO - Usar los 4 modelos en paralelo
    async analyzeComplete(text: string): Promise<AnalysisResponse> {
        this.ensureModelsLoaded();

        try {
            this.logger.log(`🔍 Analizando texto: "${text.substring(0, 50)}..."`);

            // Ejecutar los 4 análisis en paralelo
            const [sentimentResult, entitiesResult, emotionResult, intentResult] = await Promise.all([
                this.analyzeSentiment(text),
                this.extractEntities(text),
                this.analyzeEmotion(text),
                this.classifyIntent(text),
            ]);

            const response: AnalysisResponse = {
                text,
                analysis: {
                    sentiment: sentimentResult,
                    emotion: emotionResult,
                    entities: entitiesResult,
                    intent: intentResult,
                },
                timestamp: new Date().toISOString(),
            };

            this.logger.log('✅ Análisis completo finalizado');
            return response;

        } catch (error) {
            this.logger.error(' Error en análisis completo:', error.message);
            throw new Error(`Analysis failed: ${error.message}`);
        }
    }

    // ANÁLISIS INDIVIDUAL 1: Sentimientos
    async analyzeSentiment(text: string): Promise<SentimentResult> {
        this.ensureModelsLoaded();

        try {
            const result = await this.sentimentPipeline(text);
            return {
                label: result[0].label,
                score: Math.round(result[0].score * 100) / 100, // 2 decimales
            };
        } catch (error) {
            this.logger.error('Error en análisis de sentimientos:', error.message);
            throw error;
        }
    }

    // ANÁLISIS INDIVIDUAL 2: Entidades Nombradas
    async extractEntities(text: string): Promise<NamedEntity[]> {
        this.ensureModelsLoaded();

        try {
            const result = await this.nerPipeline(text);

            // Transformar el resultado del modelo a nuestro formato
            return result.map((entity: any) => ({
                entity: entity.entity,
                word: entity.word,
                start: entity.start || 0,
                end: entity.end || 0,
                score: Math.round(entity.score * 100) / 100,
            }));
        } catch (error) {
            this.logger.error('Error en extracción de entidades:', error.message);
            throw error;
        }
    }

    // ANÁLISIS INDIVIDUAL 3: Emociones
    async analyzeEmotion(text: string): Promise<EmotionResult> {
        this.ensureModelsLoaded();

        try {
            const result = await this.emotionPipeline(text);
            return {
                label: result[0].label,
                score: Math.round(result[0].score * 100) / 100,
            };
        } catch (error) {
            this.logger.error('Error en análisis de emociones:', error.message);
            throw error;
        }
    }

    // ANÁLISIS INDIVIDUAL 4: Intención
    async classifyIntent(text: string): Promise<IntentResult> {
        this.ensureModelsLoaded();

        try {
            const result = await this.intentPipeline(text);
            return {
                label: result[0].label,
                score: Math.round(result[0].score * 100) / 100,
            };
        } catch (error) {
            this.logger.error('Error en clasificación de intención:', error.message);
            throw error;
        }
    }

    // UTILIDAD: Estado de los modelos
    async getModelsStatus() {
        return {
            modelsLoaded: this.modelsLoaded,
            models: this.modelStatus,
            loadedAt: this.modelsLoaded ? new Date().toISOString() : null,
        };
    }

    // UTILIDAD: Estadísticas del servicio
    async getServiceInfo() {
        return {
            availableModels: Object.keys(ANALYSIS_MODELS),
            modelDetails: ANALYSIS_MODELS,
            status: await this.getModelsStatus(),
        };
    }
}