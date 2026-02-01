// ProjectX OS — AI Service
// Handles LLM connections (local Ollama or cloud fallback)

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  source: 'ollama' | 'fallback' | 'cache';
  model?: string;
}

// System prompt for ProjectX AI Assistant
const SYSTEM_PROMPT = `You are the ProjectX AI Guide, a helpful assistant embedded in the ProjectX OS learning platform.

ProjectX OS is a learning operating system that helps humans develop real-world capabilities through:
- **Missions**: Hands-on projects that earn XP and badges
- **Four Phases**: eXperience (Learn) → eXperiment (Work) → eXcel (Earn) → eXpand (Invent)
- **Verified Credentials**: Badges and portfolios that prove capability

Your role:
1. Help users understand how ProjectX works
2. Guide students through missions and learning
3. Answer questions about XP, badges, levels, and progression
4. Provide encouragement and support
5. Explain concepts clearly and concisely

Be friendly, encouraging, and concise. Use emojis sparingly. Focus on actionable guidance.
When you don't know something specific about the platform, admit it and offer to help in other ways.`;

// Local knowledge for common questions (fallback when LLM unavailable)
const LOCAL_KNOWLEDGE: Record<string, string> = {
  'what is projectx': `ProjectX OS is a learning operating system that transforms how you develop capabilities. Instead of passive courses, you work on real missions, earn XP, and build a verified portfolio.

**The Four Phases:**
1. 🟠 **eXperience** - Learn through guided missions
2. 🔵 **eXperiment** - Collaborate on team challenges
3. 🟣 **eXcel** - Earn credentials and opportunities
4. 🔴 **eXpand** - Create impact globally`,

  'how do missions work': `**Missions** are hands-on projects that build real skills:

1. Read the objective and understand what you need to do
2. Work through the steps at your own pace
3. Submit your work (code, design, document, etc.)
4. Get reviewed by a facilitator
5. Earn XP and potentially badges!

Each mission shows difficulty, estimated time, and XP reward upfront.`,

  'what is xp': `**XP (Experience Points)** measures your progress:

- Complete missions to earn XP
- Higher difficulty = more XP
- XP determines your level (Rookie → Pro → Expert → Master)
- Higher levels unlock new features and opportunities

Focus on quality work - rushing won't help you grow!`,

  'default': `I'm the ProjectX AI Guide! I can help you with:

- Understanding how ProjectX works
- Navigating missions and learning paths
- Questions about XP, badges, and progression
- General guidance on your learning journey

What would you like to know?`,
};

// Check if Ollama is available
async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Query Ollama LLM
async function queryOllama(messages: AIMessage[], model = 'llama3.2'): Promise<string> {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return data.message?.content || 'Sorry, I couldn\'t generate a response.';
}

// Local fallback response
function getLocalResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  for (const [key, response] of Object.entries(LOCAL_KNOWLEDGE)) {
    if (lowerQuery.includes(key)) {
      return response;
    }
  }
  
  // Fuzzy matching
  if (lowerQuery.includes('start') || lowerQuery.includes('begin')) {
    return LOCAL_KNOWLEDGE['how do missions work'];
  }
  if (lowerQuery.includes('level') || lowerQuery.includes('progress')) {
    return LOCAL_KNOWLEDGE['what is xp'];
  }
  
  return LOCAL_KNOWLEDGE['default'];
}

// Main AI query function
export async function queryAI(
  messages: AIMessage[],
  options: { preferLocal?: boolean; model?: string } = {}
): Promise<AIResponse> {
  const { preferLocal = false, model = 'llama3.2' } = options;
  
  // If preferLocal, skip LLM entirely
  if (preferLocal) {
    const lastMessage = messages[messages.length - 1];
    return {
      content: getLocalResponse(lastMessage?.content || ''),
      source: 'fallback',
    };
  }
  
  // Try Ollama first
  const ollamaAvailable = await checkOllamaHealth();
  
  if (ollamaAvailable) {
    try {
      const content = await queryOllama(messages, model);
      return {
        content,
        source: 'ollama',
        model,
      };
    } catch (error) {
      console.error('Ollama query failed:', error);
      // Fall through to fallback
    }
  }
  
  // Fallback to local knowledge
  const lastMessage = messages[messages.length - 1];
  return {
    content: getLocalResponse(lastMessage?.content || ''),
    source: 'fallback',
  };
}

// Streaming version for better UX (future implementation)
export async function* streamAI(
  messages: AIMessage[],
  model = 'llama3.2'
): AsyncGenerator<string> {
  const ollamaAvailable = await checkOllamaHealth();
  
  if (!ollamaAvailable) {
    const lastMessage = messages[messages.length - 1];
    yield getLocalResponse(lastMessage?.content || '');
    return;
  }
  
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
    }),
  });
  
  if (!response.ok || !response.body) {
    yield getLocalResponse(messages[messages.length - 1]?.content || '');
    return;
  }
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(Boolean);
    
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.message?.content) {
          yield json.message.content;
        }
      } catch {
        // Skip invalid JSON
      }
    }
  }
}

// Get available models from Ollama
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch {
    return [];
  }
}
