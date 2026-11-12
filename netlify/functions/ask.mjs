const SYSTEM_INSTRUCTION = `आप AARVIK AI हैं — एक सहायक, धैर्यवान और स्पष्ट शिक्षक।
हमेशा उपयोगकर्ता की भाषा समझें; यदि उपयोगकर्ता हिंदी या Hinglish में पूछे तो सरल, शुद्ध और स्वाभाविक हिंदी में उत्तर दें।
उत्तर को शीर्षक और क्रमांकित बिंदुओं में व्यवस्थित करें। हर मुख्य बिंदु को आसान भाषा में समझाएँ, जहाँ उपयोगी हो उदाहरण और चरण दें, और अंत में छोटा सारांश दें।
कठिन अंग्रेज़ी/तकनीकी शब्दों का हिंदी अर्थ भी बताएँ। उपयोगकर्ता यदि छोटा उत्तर माँगे तो संक्षिप्त रहें।
सटीकता महत्वपूर्ण है: जानकारी निश्चित न हो तो साफ़ बताएँ; तथ्य, अनुमान और राय में अंतर रखें। चिकित्सा, कानून, वित्त या सुरक्षा के विषयों में सामान्य जानकारी दें, व्यक्तिगत विशेषज्ञ सलाह का विकल्प होने का दावा न करें। कभी यह दावा न करें कि आपने इंटरनेट पर खोजा है, जब तक वास्तव में कोई खोज उपकरण उपलब्ध न हो।`;

export default async (request) => {
  if (request.method !== "POST") return json({ error: "केवल POST अनुरोध स्वीकार है।" }, 405);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: "Gemini API Key सेट नहीं है। Netlify → Site configuration → Environment variables में GEMINI_API_KEY जोड़ें।" }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: "अनुरोध पढ़ा नहीं जा सका।" }, 400); }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const contents = messages
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content.slice(0, 4000) }] }));
  if (!contents.length || contents[contents.length - 1].role !== "user") return json({ error: "पहले अपना सवाल लिखें।" }, 400);

  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: { temperature: 0.65, maxOutputTokens: 4096 },
      }),
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      const message = data?.error?.message || `Gemini API त्रुटि (${upstream.status})`;
      return json({ error: message }, upstream.status === 429 ? 429 : 502);
    }
    const answer = (data?.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("\n").trim();
    if (!answer) return json({ error: "AI ने इस बार उत्तर नहीं दिया। कृपया सवाल दोबारा लिखें।" }, 502);
    return json({ answer });
  } catch (error) {
    return json({ error: "AI सर्वर से संपर्क नहीं हो पाया। इंटरनेट कनेक्शन जाँचें और फिर प्रयास करें।" }, 502);
  }
};

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
