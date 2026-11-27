
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return new Response("OS GUARDIÕES online.", {
        headers: cors
      });
    }

    try {
      if (!env.OPENROUTER_API_KEY) {
        throw new Error("Chave de IA não configurada.");
      }

      const body = await request.json();

      const resposta = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://joaopedduarteee-dev.github.io/-os-guardioes/",
            "X-OpenRouter-Title": "OS GUARDIÕES"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "Você é OS GUARDIÕES, um assistente pessoal inspirado no JARVIS. Fale português brasileiro, com personalidade masculina, elegante, educada, inteligente, leal e prestativa. Seja claro e honesto. Nunca afirme que realizou ações que não realizou."
              },
              ...(Array.isArray(body.messages) ? body.messages : [])
            ]
          })
        }
      );

      const dados = await resposta.json();

      return new Response(JSON.stringify(dados), {
        status: resposta.status,
        headers: {
          ...cors,
          "Content-Type": "application/json"
        }
      });

    } catch (erro) {
      return new Response(JSON.stringify({
        error: { message: erro.message }
      }), {
        status: 500,
        headers: {
          ...cors,
          "Content-Type": "application/json"
        }
      });
    }
  }
};
