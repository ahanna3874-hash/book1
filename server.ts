import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GenerateCardRequest {
  bookTitle?: string;
  sceneDescription?: string;
}

interface QuestionCard {
  type: 'fact' | 'emotion' | 'connection';
  categoryTitle: string;
  badgeText: string;
  question: string;
  hint: string;
  thinkPrompt: string;
}

interface CardGenerationResponse {
  isValid: boolean;
  guidanceMessage?: string;
  bookTitle?: string;
  sceneSummary?: string;
  cards?: QuestionCard[];
}

app.post('/api/generate-cards', async (req, res) => {
  try {
    const { bookTitle, sceneDescription } = req.body as GenerateCardRequest;

    if (!bookTitle || !bookTitle.trim()) {
      return res.status(400).json({
        isValid: false,
        guidanceMessage: '책의 제목을 입력해 주세요. 어떤 책을 읽었는지 궁금해요! 📖',
      });
    }

    if (!sceneDescription || !sceneDescription.trim()) {
      return res.status(400).json({
        isValid: false,
        guidanceMessage: '인상 깊었던 장면을 적어 주세요. 짧은 한두 줄이어도 괜찮아요! ✨',
      });
    }

    const trimmedTitle = bookTitle.trim();
    const trimmedScene = sceneDescription.trim();

    // System prompt tailored for Korean middle schoolers (grades 7-9)
    const prompt = `
당신은 중학교 1~3학년(만 12~15세) 학생들의 독서 생각 확장을 돕는 친절하고 다정한 독서 멘토 교사입니다.
학생이 작성한 [책 제목]과 [인상 깊은 장면]을 검토하고, 질문 카드 3장을 JSON으로 만들어 주세요.

[학생의 입력]
- 책 제목: ${trimmedTitle}
- 인상 깊은 장면: ${trimmedScene}

[지침]
1. 입력 적절성 판별 (isValid):
   - 비속어, 욕설, 폭력/성적 장난, 무의미한 자음/모음 난타(예: "ㅋㅋㅋ", "asdf", "ㅁㄴㅇㄹ", 단순 낙서)인 경우 isValid를 false로 지정하세요.
   - 학생이 책 제목과 장면을 성실히 나누려 한다면 isValid를 true로 판단하세요.
   - isValid가 false인 경우, 학생을 나무라지 않고 다정하고 정중하게 다시 쓰도록 안내하는 guidanceMessage를 작성하세요.
     (예: "책의 제목과 마음에 남았던 장면을 조금 더 솔직하고 자세히 적어 주면, 멋진 질문 카드를 만들어 줄 수 있어요. 다시 한번 작성해 볼까요? 😊")

2. 질문 카드 3장 생성 규칙 (isValid가 true일 때):
   cards 배열에는 반드시 다음 3종류의 카드가 순서대로 1장씩 포함되어야 합니다:
   1) 첫 번째 카드 (type: "fact"):
      - categoryTitle: "사실 확인"
      - badgeText: "🔍 사실 확인"
      - question: 책 속 그 장면에서 실제로 어떤 일이 일어났는지, 배경이나 인물의 구체적 행동 등 사실을 확인하는 질문.
      - 규칙: 반드시 쉬운 단어로 된 '단 1개의 완결된 문장'. 질문 본문에 절대 답을 주지 마세요.
      - hint: 학생이 장면을 떠올릴 수 있도록 돕는 "생각을 돕는 힌트" (1~2문장).
      - thinkPrompt: "장면 속 단서 살펴보기"
   2) 두 번째 카드 (type: "emotion"):
      - categoryTitle: "인물 마음 추측"
      - badgeText: "💭 인물 마음 추측"
      - question: 그 순간 등장인물이 느꼈을 감정이나 말/행동 뒤에 숨겨진 까닭을 깊이 있게 헤아려보는 질문.
      - 규칙: 반드시 쉬운 단어로 된 '단 1개의 완결된 문장'. 답을 정해두지 마세요.
      - hint: 인물의 표정, 처지, 행동을 떠올려보게 돕는 "생각을 돕는 힌트".
      - thinkPrompt: "인물의 내면 헤아리기"
   3) 세 번째 카드 (type: "connection"):
      - categoryTitle: "나와 연결하기"
      - badgeText: "🌟 나와 연결하기"
      - question: 그 장면의 고민, 갈등, 혹은 가치를 학생 자신의 일상, 학교생활, 친구 관계, 혹은 '나라면 어땠을까'와 연결하는 질문.
      - 규칙: 반드시 쉬운 단어로 된 '단 1개의 완결된 문장'. 정답이 없는 열린 질문이어야 함.
      - hint: 자신의 경험이나 가치관을 끌어낼 수 있는 "생각을 돕는 힌트".
      - thinkPrompt: "나의 삶과 연결하기"

3. 공통 규칙:
   - 모든 질문(question)은 중학생 눈높이의 친근하고 다정한 존댓말 ("~했을까요?", "~어떤 마음이었을까요?", "~있었나요?") 한 문장이어야 합니다.
   - 절대 질문에 답이나 해설을 포함하지 마세요. 답을 주지 않고 스스로 생각하게 돕는 것이 핵심입니다.
   - 학생 이름은 묻지 않으며, 입력 내용은 저장하지 않습니다.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: {
              type: Type.BOOLEAN,
              description: 'Whether student input is genuine book title and scene',
            },
            guidanceMessage: {
              type: Type.STRING,
              description: 'Polite guidance if isValid is false',
            },
            sceneSummary: {
              type: Type.STRING,
              description: 'Appreciative 1-sentence recap of the scene',
            },
            cards: {
              type: Type.ARRAY,
              description: 'Exactly 3 question cards: fact, emotion, connection',
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: 'fact | emotion | connection',
                  },
                  categoryTitle: {
                    type: Type.STRING,
                  },
                  badgeText: {
                    type: Type.STRING,
                  },
                  question: {
                    type: Type.STRING,
                  },
                  hint: {
                    type: Type.STRING,
                  },
                  thinkPrompt: {
                    type: Type.STRING,
                  },
                },
                required: ['type', 'categoryTitle', 'badgeText', 'question', 'hint', 'thinkPrompt'],
              },
            },
          },
          required: ['isValid'],
        },
      },
    });

    let rawText = response.text?.trim() || '{}';
    // Clean potential markdown wrappers
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }

    let parsed: CardGenerationResponse;
    try {
      parsed = JSON.parse(rawText) as CardGenerationResponse;
    } catch {
      return res.status(500).json({
        isValid: false,
        guidanceMessage: '카드를 만드는 중 작은 오류가 생겼습니다. 다시 한번 눌러주세요!',
      });
    }

    // Default badges and category names if missing
    const defaultLabels: Record<string, { cat: string; badge: string; prompt: string }> = {
      fact: { cat: '사실 확인', badge: '🔍 사실 확인', prompt: '장면 속 단서 살펴보기' },
      emotion: { cat: '인물 마음 추측', badge: '💭 인물 마음 추측', prompt: '인물의 내면 헤아리기' },
      connection: { cat: '나와 연결하기', badge: '🌟 나와 연결하기', prompt: '나의 삶과 연결하기' },
    };

    const validatedCards: QuestionCard[] = (parsed.cards || []).map((card, i) => {
      const typeKey = (['fact', 'emotion', 'connection'][i] || card.type || 'fact') as 'fact' | 'emotion' | 'connection';
      const defaults = defaultLabels[typeKey] || defaultLabels.fact;
      return {
        type: typeKey,
        categoryTitle: card.categoryTitle || defaults.cat,
        badgeText: card.badgeText || defaults.badge,
        question: card.question || '',
        hint: card.hint || '',
        thinkPrompt: card.thinkPrompt || defaults.prompt,
      };
    });

    // Pure ephemeral response - no database or disk storage
    return res.json({
      isValid: parsed.isValid,
      guidanceMessage: parsed.guidanceMessage,
      bookTitle: trimmedTitle,
      sceneSummary: parsed.sceneSummary || '',
      cards: validatedCards,
    });
  } catch (error) {
    console.error('Error generating question cards:', error);
    return res.status(500).json({
      isValid: false,
      guidanceMessage: '카드를 만드는 중 잠시 연결이 원활하지 않았습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
