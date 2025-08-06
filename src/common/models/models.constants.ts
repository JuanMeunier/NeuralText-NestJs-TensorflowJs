export const ANALYSIS_MODELS = {
    // 1. Análisis de Sentimientos (Positivo/Negativo/Neutro)
    SENTIMENT: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',

    // 2. Reconocimiento de Entidades (Personas, Lugares, Organizaciones)
    NER: 'Xenova/bert-base-NER',

    // 3. Detección de Emociones (Alegría, Tristeza, Ira, Miedo, etc.)
    EMOTION: 'Xenova/j-hartmann-emotion-english-distilroberta-base',

    // 4. Clasificación de Intención (Pregunta, Queja, Elogio, etc.)
    INTENT: 'Xenova/microsoft-DialoGPT-medium'
};