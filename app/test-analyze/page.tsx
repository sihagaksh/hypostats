"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Brain,
  FileText,
  Edit3,
  Upload,
  AlertCircle,
  Home,
  Sparkles,
  CheckCircle,
  XCircle,
  Calculator,
  Target,
  Database,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import MaxWidthWrapper from "@/components/max-width-wrapper"

interface AnalyzedParameters {
  numSamples: number
  claimType: number
  pValue: number
  isKnown: string
  hypothesizedValue: number
  knownParam?: number
  knownParam2?: number
  claimDirection: string
  explanation: string
}

interface TestResult {
  conclusion: string
  details: {
    sample_size?: number
    sample_mean?: number
    sample_std?: number
    test_statistic?: number
    critical_value?: number
    sample_size1?: number
    sample_size2?: number
    sample_mean1?: number
    sample_mean2?: number
    sample_variance1?: number
    sample_variance2?: number
    test_type?: string
  }
}

export default function TestAnalyzePage() {
  const [questionText, setQuestionText] = useState<string>("")
  const [dataInputMethod, setDataInputMethod] = useState<string>("csv")
  const [csvData, setCsvData] = useState<string>("")
  const [manualData1, setManualData1] = useState<string>("")
  const [manualData2, setManualData2] = useState<string>("")
  const [analyzedParams, setAnalyzedParams] = useState<AnalyzedParameters | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [error, setError] = useState<string>("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCsvData(content)
      }
      reader.readAsText(file)
    }
  }

  const convertManualDataToCsv = () => {
    if (dataInputMethod === "csv") return csvData

    if (analyzedParams?.numSamples === 1) {
      const values = manualData1
        .split(/[,\s]+/)
        .filter((val) => val.trim() !== "")
        .map((val) => val.trim())
      return values.join("\n")
    } else {
      const values1 = manualData1
        .split(/[,\s]+/)
        .filter((val) => val.trim() !== "")
        .map((val) => val.trim())
      const values2 = manualData2
        .split(/[,\s]+/)
        .filter((val) => val.trim() !== "")
        .map((val) => val.trim())

      const maxLength = Math.max(values1.length, values2.length)
      const csvRows = []
      for (let i = 0; i < maxLength; i++) {
        const val1 = values1[i] || ""
        const val2 = values2[i] || ""
        csvRows.push(`${val1},${val2}`)
      }
      return csvRows.join("\n")
    }
  }

  const analyzeQuestion = async () => {
    if (!questionText.trim()) {
      setError("Please enter a question to analyze")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setAnalyzedParams(null)

    try {
      const response = await fetch("/api/analyze-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionText }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to analyze question")
      }

      setAnalyzedParams(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while analyzing the question")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const runHypothesisTest = async () => {
    if (!analyzedParams) {
      setError("Please analyze the question first")
      return
    }

    const finalCsvData = convertManualDataToCsv()

    if (!finalCsvData) {
      setError("Please provide data for the hypothesis test")
      return
    }

    // Validate manual data if using manual input
    if (dataInputMethod === "manual") {
      if (!manualData1.trim()) {
        setError("Please enter data for sample 1")
        return
      }
      if (analyzedParams.numSamples === 2 && !manualData2.trim()) {
        setError("Please enter data for sample 2")
        return
      }
    }

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/hypothesis-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numSamples: analyzedParams.numSamples,
          claimType: analyzedParams.claimType,
          pValue: analyzedParams.pValue,
          csvData: finalCsvData,
          isKnown: analyzedParams.isKnown,
          hypothesizedValue: analyzedParams.hypothesizedValue,
          knownParam: analyzedParams.knownParam,
          knownParam2: analyzedParams.knownParam2,
          claimDirection: analyzedParams.claimDirection,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to perform hypothesis test")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setQuestionText("")
    setDataInputMethod("csv")
    setCsvData("")
    setManualData1("")
    setManualData2("")
    setAnalyzedParams(null)
    setResult(null)
    setError("")
  }

  // Sample questions for demonstration
  const sampleQuestions = [
    "A manufacturer claims that the mean weight of their product is 500 grams with a standard deviation of 15 grams. A sample of 25 products has a mean weight of 495 grams. Test at α = 0.05 if the mean weight is significantly different from 500 grams.",
    "A company claims their average delivery time is less than 30 minutes. Test this claim at α = 0.01 significance level.",
    "Test whether the variance of population A is greater than the variance of population B at the 0.05 significance level.",
  ]

  return (
    <div className="min-h-screen bg-background">
      <MaxWidthWrapper>
        <div className="py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Powered <span className="text-primary">Test Analyzer</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Paste your hypothesis testing question and let AI extract all the parameters automatically
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question Analysis Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Question Analysis
                  </CardTitle>
                  <CardDescription>
                    Paste your hypothesis testing question below and AI will automatically identify the test parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="questionText" className="text-base font-medium">
                      Hypothesis Testing Question *
                    </Label>
                    <Textarea
                      id="questionText"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Example: A manufacturer claims that the mean weight of their product is 500 grams with a standard deviation of 15 grams. A sample of 25 products has a mean weight of 495 grams. Test at α = 0.05 if the mean weight is significantly different from 500 grams."
                      className="h-32 resize-none"
                    />
                  </div>

                  {/* Sample Questions */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Sample Questions (click to use):</Label>
                    <div className="space-y-2">
                      {sampleQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-left h-auto p-4 whitespace-normal justify-start bg-muted/30 hover:bg-muted/50 border-dashed"
                          onClick={() => setQuestionText(question)}
                        >
                          <div className="text-sm leading-relaxed">{question}</div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={analyzeQuestion} disabled={isAnalyzing} size="lg" className="w-full">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Question...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-5 w-5" />
                        Analyze Question with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Data Input Section */}
              {analyzedParams && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      Data Input
                    </CardTitle>
                    <CardDescription>Provide your sample data for the hypothesis test</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Data Input Method Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Data Input Method *</Label>
                      <RadioGroup value={dataInputMethod} onValueChange={setDataInputMethod}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="csv" id="csv-method" />
                          <Label htmlFor="csv-method" className="flex items-center gap-2 cursor-pointer">
                            <Upload className="h-4 w-4" />
                            Upload CSV File
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manual" id="manual-method" />
                          <Label htmlFor="manual-method" className="flex items-center gap-2 cursor-pointer">
                            <Edit3 className="h-4 w-4" />
                            Enter Data Manually
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Data Input Section */}
                    {dataInputMethod === "csv" ? (
                      <div className="space-y-3">
                        <Label htmlFor="csvFile" className="text-base font-medium">
                          Upload CSV Data *
                        </Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="csvFile"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="flex-1"
                          />
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        {csvData && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Data Preview:</Label>
                            <Textarea
                              value={csvData.slice(0, 200) + (csvData.length > 200 ? "..." : "")}
                              readOnly
                              className="h-20 text-sm bg-muted/50"
                            />
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                          <p className="font-medium mb-1">File Format:</p>
                          <p>• For 1 sample: Upload a CSV with one column of values</p>
                          <p>• For 2 samples: Upload a CSV with two columns (sample 1, sample 2)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="manualData1" className="text-base font-medium">
                            {analyzedParams.numSamples === 1 ? "Sample Data" : "Sample 1 Data"} *
                          </Label>
                          <Textarea
                            id="manualData1"
                            value={manualData1}
                            onChange={(e) => setManualData1(e.target.value)}
                            placeholder="Enter numbers separated by commas or spaces (e.g., 1.2, 3.4, 5.6, 7.8)"
                            className="h-24 resize-none"
                          />
                        </div>

                        {analyzedParams.numSamples === 2 && (
                          <div className="space-y-3">
                            <Label htmlFor="manualData2" className="text-base font-medium">
                              Sample 2 Data *
                            </Label>
                            <Textarea
                              id="manualData2"
                              value={manualData2}
                              onChange={(e) => setManualData2(e.target.value)}
                              placeholder="Enter numbers separated by commas or spaces (e.g., 2.1, 4.3, 6.5, 8.7)"
                              className="h-24 resize-none"
                            />
                          </div>
                        )}

                        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                          <p className="font-medium mb-1">Data Format:</p>
                          <p>Enter your data values separated by commas or spaces</p>
                          <p className="text-xs mt-1">Example: 1.2, 3.4, 5.6, 7.8</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button onClick={runHypothesisTest} disabled={isLoading} size="lg" className="flex-1">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Running Test...
                          </>
                        ) : (
                          <>
                            <Calculator className="mr-2 h-5 w-5" />
                            Run Hypothesis Test
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={resetForm} size="lg">
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Analyzed Parameters Display */}
              {analyzedParams && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Extracted Parameters
                    </CardTitle>
                    <CardDescription>AI has identified the following test parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2 text-primary">AI Analysis:</h3>
                      <p className="text-sm text-muted-foreground">{analyzedParams.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Samples:</span>
                        <Badge variant="secondary">{analyzedParams.numSamples}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Test Type:</span>
                        <Badge variant="secondary">{analyzedParams.claimType === 1 ? "Mean (μ)" : "Std Dev (σ)"}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Alpha (α):</span>
                        <Badge variant="outline">{analyzedParams.pValue}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Population Known:</span>
                        <Badge variant={analyzedParams.isKnown === "yes" ? "default" : "secondary"}>
                          {analyzedParams.isKnown === "yes" ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">H₀ Value:</span>
                        <Badge variant="outline">{analyzedParams.hypothesizedValue}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Direction:</span>
                        <Badge variant="outline">
                          {analyzedParams.claimDirection === "greater"
                            ? "Greater (≥)"
                            : analyzedParams.claimDirection === "less"
                              ? "Less (≤)"
                              : "Equal (=)"}
                        </Badge>
                      </div>
                      {analyzedParams.knownParam && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Known Param:</span>
                          <Badge variant="outline">{analyzedParams.knownParam}</Badge>
                        </div>
                      )}
                      {analyzedParams.knownParam2 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Known Param 2:</span>
                          <Badge variant="outline">{analyzedParams.knownParam2}</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results Display */}
              {result && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {result.conclusion.includes("Reject") ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      Test Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className={`p-4 rounded-lg text-center font-medium ${
                        result.conclusion.includes("Reject")
                          ? "bg-destructive/10 text-destructive border border-destructive/20"
                          : "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                      }`}
                    >
                      {result.conclusion.includes("Reject") ? "Reject H₀" : "Fail to Reject H₀"}
                    </div>

                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{result.conclusion}</div>

                    {result.details && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Test Details:</h4>
                        <div className="space-y-2 text-sm">
                          {result.details.test_type && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Test Type:</span>
                              <Badge variant="secondary">{result.details.test_type}</Badge>
                            </div>
                          )}
                          {result.details.test_statistic !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Test Statistic:</span>
                              <Badge>{result.details.test_statistic.toFixed(4)}</Badge>
                            </div>
                          )}
                          {result.details.critical_value !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Critical Value:</span>
                              <Badge>{result.details.critical_value.toFixed(4)}</Badge>
                            </div>
                          )}
                          {result.details.sample_mean !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sample Mean:</span>
                              <Badge variant="outline">{result.details.sample_mean.toFixed(4)}</Badge>
                            </div>
                          )}
                          {result.details.sample_std !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sample Std:</span>
                              <Badge variant="outline">{result.details.sample_std.toFixed(4)}</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Service Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Service Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">AI Analysis Service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Python Web Service</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Powered by OpenRouter & scipy.stats</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="max-w-4xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {error}
                {error.includes("Payment required") && (
                  <div className="mt-2">
                    <p>
                      Please check your OpenRouter account balance or try using the{" "}
                      <Link href="/test" className="underline font-medium">
                        manual calculator
                      </Link>{" "}
                      instead.
                    </p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
