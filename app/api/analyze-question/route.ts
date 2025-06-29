import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { questionText } = await request.json()

    // Use environment variable for API key, with fallback to the provided key
    const OPENROUTER_API_KEY =
      process.env.OPENROUTER_API_KEY || "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"

    const prompt = `
You are an expert statistician. Analyze the following hypothesis testing question and extract the key parameters. Return your response as a JSON object with the following structure:

{
  "numSamples": 1 or 2,
  "claimType": 1 for mean testing, 2 for standard deviation/variance testing,
  "pValue": significance level (e.g., 0.05),
  "isKnown": "yes" if population parameter is known, "no" if unknown,
  "hypothesizedValue": the value being tested (μ₀ or σ₀),
  "knownParam": known population parameter if applicable (σ for mean tests, μ for variance tests),
  "knownParam2": second known parameter for two-sample tests if applicable,
  "claimDirection": "greater" for >, "less" for <, "equal" for ≠ (two-tailed),
  "explanation": "Brief explanation of your analysis"
}

Guidelines:
- For mean tests: claimType = 1
- For variance/standard deviation tests: claimType = 2
- If testing μ > μ₀ or μ ≥ μ₀: claimDirection = "greater"
- If testing μ < μ₀ or μ ≤ μ₀: claimDirection = "less"  
- If testing μ ≠ μ₀ or μ = μ₀ (two-tailed): claimDirection = "equal"
- If population σ is given: isKnown = "yes", knownParam = σ value
- If population μ is given for variance tests: isKnown = "yes", knownParam = μ value
- Default significance level is 0.05 if not specified
- For two-sample tests, numSamples = 2

Question to analyze:
${questionText}

Return only the JSON object, no additional text.
`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hypothesis-testing-app.vercel.app", // Optional: your site URL
        "X-Title": "Hypothesis Testing App", // Optional: your app name
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free", // Using a free model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenRouter API error:", response.status, errorText)

      // Provide specific error messages based on status code
      if (response.status === 402) {
        throw new Error("Payment required: Please check your OpenRouter API key balance or billing settings")
      } else if (response.status === 401) {
        throw new Error("Unauthorized: Invalid API key")
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded: Please try again later")
      } else {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from AI service")
    }

    const aiResponse = data.choices[0].message.content

    // Parse the JSON response from AI
    let parsedResponse
    try {
      // Clean the response in case there's extra text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        parsedResponse = JSON.parse(aiResponse)
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse)
      throw new Error("Failed to parse AI analysis. The AI response was not in the expected format.")
    }

    // Validate the response structure
    const requiredFields = ["numSamples", "claimType", "pValue", "isKnown", "hypothesizedValue", "claimDirection"]
    for (const field of requiredFields) {
      if (!(field in parsedResponse)) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Ensure numeric fields are numbers
    parsedResponse.numSamples = Number(parsedResponse.numSamples)
    parsedResponse.claimType = Number(parsedResponse.claimType)
    parsedResponse.pValue = Number(parsedResponse.pValue)
    parsedResponse.hypothesizedValue = Number(parsedResponse.hypothesizedValue)

    if (parsedResponse.knownParam) {
      parsedResponse.knownParam = Number(parsedResponse.knownParam)
    }
    if (parsedResponse.knownParam2) {
      parsedResponse.knownParam2 = Number(parsedResponse.knownParam2)
    }

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze question",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
