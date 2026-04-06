/**
 * API Client for Sign Language Translator Backend
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

interface SpeechToTextRequest {
  audio_data: string;
  language?: string;
  sample_rate?: number;
}

interface SpeechToTextResponse {
  text: string;
  language: string;
  confidence: number;
  timestamp: string;
}

interface TranslationRequest {
  text: string;
  source_language?: string;
  target_language?: string;
  split_unknown_words?: boolean;
}

interface SignElement {
  type: 'word' | 'letter' | 'unknown';
  value: string;
  video_path: string | null;
  display_name: string | null;
}

interface TranslationResponse {
  original_text: string;
  translated_signs: SignElement[];
  total_signs: number;
  translation_mode: string;
  timestamp: string;
}

interface DictionaryWord {
  word: string;
  translation: string;
  category: string;
  video_path?: string;
  description?: string;
  usage_examples?: string[];
}

interface DictionaryLetter {
  letter: string;
  name: string;
  category: string;
}

interface DictionaryResponse {
  words: DictionaryWord[];
  letters: DictionaryLetter[];
  total_count: number;
  page: number;
  page_size: number;
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
}

/**
 * Speech to Text API
 */
export const speechApi = {
  async toText(request: SpeechToTextRequest): Promise<SpeechToTextResponse> {
    const response = await fetch(`${API_BASE_URL}/speech-to-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleResponse<SpeechToTextResponse>(response);
  },

  async status(): Promise<{ service: string; status: string; model_loaded: boolean }> {
    const response = await fetch(`${API_BASE_URL}/speech-status`);
    return handleResponse(response);
  },
};

/**
 * Translation API
 */
export const translationApi = {
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleResponse<TranslationResponse>(response);
  },

  async batchTranslate(texts: string[]): Promise<TranslationResponse> {
    const response = await fetch(`${API_BASE_URL}/translate/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(texts),
    });
    return handleResponse<TranslationResponse>(response);
  },

  async status(): Promise<{ service: string; status: string; cache_loaded: boolean }> {
    const response = await fetch(`${API_BASE_URL}/translate/status`);
    return handleResponse(response);
  },
};

/**
 * Dictionary API
 */
export const dictionaryApi = {
  async getAll(page = 1, pageSize = 50, category?: string): Promise<DictionaryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (category) params.append('category', category);

    const response = await fetch(`${API_BASE_URL}/dictionary?${params}`);
    return handleResponse<DictionaryResponse>(response);
  },

  async getWords(category?: string): Promise<DictionaryWord[]> {
    const params = category ? `?category=${category}` : '';
    const response = await fetch(`${API_BASE_URL}/dictionary/words${params}`);
    return handleResponse<DictionaryWord[]>(response);
  },

  async getLetters(): Promise<DictionaryLetter[]> {
    const response = await fetch(`${API_BASE_URL}/dictionary/letters`);
    return handleResponse<DictionaryLetter[]>(response);
  },

  async getWord(word: string): Promise<DictionaryWord> {
    const response = await fetch(`${API_BASE_URL}/dictionary/word/${encodeURIComponent(word)}`);
    return handleResponse<DictionaryWord>(response);
  },

  async getLetter(letter: string): Promise<DictionaryLetter> {
    const response = await fetch(`${API_BASE_URL}/dictionary/letter/${encodeURIComponent(letter)}`);
    return handleResponse<DictionaryLetter>(response);
  },

  async search(query: string): Promise<DictionaryWord[]> {
    const response = await fetch(`${API_BASE_URL}/dictionary/search?q=${encodeURIComponent(query)}`);
    return handleResponse<DictionaryWord[]>(response);
  },

  async categories(): Promise<{ categories: string[] }> {
    const response = await fetch(`${API_BASE_URL}/dictionary/categories`);
    return handleResponse(response);
  },
};

export { ApiError };
export type { SignElement, TranslationResponse, DictionaryWord, DictionaryLetter };
