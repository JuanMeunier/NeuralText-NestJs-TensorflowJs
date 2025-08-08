// src/text-analysis/services/text-analysis.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TextAnalysisService implements OnModuleInit {
    private readonly logger = new Logger(TextAnalysisService.name);

    // Solo los modelos que sabemos que funcionan
    private sentimentPipeline: any;
    private nerPipeline: any;

    private modelsLoaded = false;
    private modelStatus = {
        sentiment: false,
        ner: false,
    };

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        this.logger.log('🤖 Iniciando carga de modelos de IA...');

        // Configurar token de Hugging Face
        const hfToken = this.configService.get<string>('HUGGINGFACE_HUB_TOKEN');

        if (hfToken) {
            process.env.HUGGINGFACE_HUB_TOKEN = hfToken;
            this.logger.log('🔑 Token de Hugging Face configurado');
        } else {
            this.logger.warn('⚠️  No se encontró HUGGINGFACE_HUB_TOKEN en .env');
            this.logger.log('📝 Intentando cargar modelos sin token...');
        }

        await this.loadModels();
    }

    private async loadModels() {
        try {
            process.env.HF_HUB_DISABLE_TELEMETRY = '1';

            const { pipeline, env } = await import('@xenova/transformers');

            env.allowRemoteModels = true;
            env.allowLocalModels = false;

            this.logger.log('📥 Cargando solo modelos que funcionan sin auth...');

            // Solo cargar los 2 modelos que sabemos que funcionan
            const [sentiment, ner] = await Promise.all([
                this.loadModel('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', 'sentiment'),
                this.loadModel('token-classification', 'Xenova/bert-base-NER', 'ner'),
            ]);

            this.sentimentPipeline = sentiment;
            this.nerPipeline = ner;

            this.modelsLoaded = true;
            this.logger.log('✅ Modelos básicos cargados exitosamente');

        } catch (error) {
            this.logger.error('❌ Error cargando modelos:', error.message);
            throw new Error(`Failed to load AI models: ${error.message}`);
        }
    }

    private async loadModel(task: any, modelName: string, type: string) {
        try {
            this.logger.log(`📦 Cargando modelo ${type}: ${modelName}`);
            const { pipeline } = await import('@xenova/transformers');

            const model = await pipeline(task, modelName, {
                revision: 'main',
            });

            this.modelStatus[type] = true;
            this.logger.log(`✅ Modelo ${type} cargado`);
            return model;
        } catch (error) {
            this.logger.error(`❌ Error cargando modelo ${type}:`, error.message);
            throw error;
        }
    }

    private ensureModelsLoaded() {
        if (!this.modelsLoaded) {
            throw new Error('Models are still loading. Please try again in a few moments.');
        }
    }

    // ANÁLISIS COMPLETO - Solo con los modelos disponibles
    async analyzeComplete(text: string) {
        this.ensureModelsLoaded();

        try {
            this.logger.log(`🔍 Analizando texto: "${text.substring(0, 50)}..."`);

            const [sentimentResult, entitiesResult] = await Promise.all([
                this.analyzeSentiment(text),
                this.extractEntities(text),
            ]);

            const response = {
                text,
                analysis: {
                    sentiment: sentimentResult,
                    entities: entitiesResult,
                    // Temporalmente disabled hasta conseguir modelos que funcionen
                    emotion: { label: 'not_available', score: 0, message: 'Emotion model requires authentication' },
                    intent: { label: 'not_available', score: 0, message: 'Intent model requires authentication' },
                },
                timestamp: new Date().toISOString(),
            };

            this.logger.log('✅ Análisis básico finalizado');
            return response;

        } catch (error) {
            this.logger.error('❌ Error en análisis:', error.message);
            throw new Error(`Analysis failed: ${error.message}`);
        }
    }

    // Análisis de sentimientos - FUNCIONA
    async analyzeSentiment(text: string) {
        this.ensureModelsLoaded();

        try {
            const result = await this.sentimentPipeline(text);
            return {
                label: result[0].label,
                score: Math.round(result[0].score * 100) / 100,
            };
        } catch (error) {
            this.logger.error('❌ Error en análisis de sentimientos:', error.message);
            throw error;
        }
    }

    // Extracción de entidades - FUNCIONA
    async extractEntities(text: string) {
        this.ensureModelsLoaded();

        try {
            const result = await this.nerPipeline(text);

            return result.map((entity: any) => ({
                entity: entity.entity,
                word: entity.word,
                start: entity.start || 0,
                end: entity.end || 0,
                score: Math.round(entity.score * 100) / 100,
            }));
        } catch (error) {
            this.logger.error('❌ Error en extracción de entidades:', error.message);
            throw error;
        }
    }

    // Métodos placeholder para emociones e intención
    async analyzeEmotion(text: string) {
        return {
            label: 'not_available',
            score: 0,
            message: 'Emotion analysis requires different model with authentication'
        };
    }

    async classifyIntent(text: string) {
        return {
            label: 'not_available',
            score: 0,
            message: 'Intent classification requires different model with authentication'
        };
    }

    async getModelsStatus() {
        return {
            modelsLoaded: this.modelsLoaded,
            models: this.modelStatus,
            loadedAt: this.modelsLoaded ? new Date().toISOString() : null,
            note: 'Only sentiment and NER models loaded. Emotion and Intent require auth.'
        };
    }

    async getServiceInfo() {
        return {
            availableModels: ['sentiment', 'ner'],
            unavailableModels: ['emotion', 'intent'],
            modelDetails: {
                sentiment: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
                ner: 'Xenova/bert-base-NER'
            },
            status: await this.getModelsStatus(),
        };
    }
}