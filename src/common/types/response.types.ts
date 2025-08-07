export interface NamedEntity {
    entity: string;      // Tipo de entidad: 'PERSON', 'ORG', 'LOC', 'MISC', etc.
    word: string;        // La palabra/frase encontrada
    start: number;       // Posición inicial en el texto
    end: number;         // Posición final en el texto
    score: number;       // Confianza del modelo (0-1)
}

// Resultado de análisis de sentimiento
export interface SentimentResult {
    label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    score: number;
}

// Resultado de análisis de emociones
export interface EmotionResult {
    label: 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'love';
    score: number;
}

// Resultado de clasificación de intención
export interface IntentResult {
    label: 'question' | 'request' | 'complaint' | 'compliment' | 'statement';
    score: number;
}

// Respuesta completa del análisis
export interface AnalysisResponse {
    text: string;
    analysis: {
        sentiment: SentimentResult;
        emotion: EmotionResult;
        entities: NamedEntity[];        // ← AQUÍ están las entities
        intent: IntentResult;
    };
    timestamp: string;
}