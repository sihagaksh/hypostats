import { type NextRequest, NextResponse } from "next/server"

const WEBSERVICE_URL = "https://hypostats-webservice-2.onrender.com"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.numSamples || !body.claimType || !body.csvData || !body.claimDirection) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Call the external Python web service
    const response = await fetch(`${WEBSERVICE_URL}/hypothesis-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Service unavailable" }))
      throw new Error(errorData.error || `Service returned ${response.status}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("API error:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { error: "Unable to connect to hypothesis testing service. Please try again later." },
          { status: 503 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to perform hypothesis test" }, { status: 500 })
  }
}
