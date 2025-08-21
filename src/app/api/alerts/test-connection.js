// Simple test file to verify API connections
export async function GET() {
  return new Response(JSON.stringify({ 
    message: "Alerts API connection test successful",
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
