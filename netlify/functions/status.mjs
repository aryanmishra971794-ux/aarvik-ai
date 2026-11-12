export default async () => {
  const configured = Boolean(process.env.GEMINI_API_KEY);

  return new Response(JSON.stringify({ configured }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};
