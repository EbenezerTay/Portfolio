import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is not configured. Add OPENAI_API_KEY to your .env or .env.local and restart the dev server.",
        },
        { status: 503 },
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = await req.json();
    const question = typeof body?.question === "string" ? body.question : "";

    if (!question.trim()) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 },
      );
    }

    const systemPrompt = `
You are an assistant that lives inside Ebenezer Tay's personal portfolio website.

Your ONLY job is to help visitors understand:
- Who Ebenezer is (background, personality, goals)
- His projects (SnapRent, Slackers Club, SwimXplorer, Young Founders Summit, etc.)
- His skills, experience, trips, certificates and achievements
- Anything clearly related to the content on this website.

Guardrails:
- If the visitor asks about news, politics, math, coding help, or anything not clearly about Ebenezer or this portfolio, you MUST refuse.
- In that case, reply briefly with something like: "I'm only here to talk about Ebenezer and his work. Try asking me about his projects, skills, trips, or certificates."
- Do NOT reveal or guess private data (phone, address, passwords, API keys, etc.).
- Keep answers short, friendly, and easy to understand (2–5 sentences).
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: question,
        },
      ],
      max_tokens: 320,
      temperature: 0.5,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate a reply.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("about-me-chat error", error);
    return NextResponse.json(
      { error: "Something went wrong talking to the profile assistant." },
      { status: 500 },
    );
  }
}

