"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, Calculator, FileText, Edit3, CheckCircle, XCircle, ArrowRight } from "lucide-react"

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

export default function HypothesisTestingApp() {
  const [numSamples, setNumSamples] = useState<string>("")
  const [claimType, setClaimType] = useState<string>("")
  const [pValue, setPValue] = useState<string>("0.05")
  const [dataInputMethod, setDataInputMethod] = useState<string>("csv")
  const [csvData, setCsvData] = useState<string>("")
  const [manualData1, setManualData1] = useState<string>("")
  const [manualData2, setManualData2] = useState<string>("")
  const [isKnown, setIsKnown] = useState<string>("")
  const [hypothesizedValue, setHypothesizedValue] = useState<string>("")
  const [knownParam, setKnownParam] = useState<string>("")
  const [knownParam2, setKnownParam2] = useState<string>("")
  const [claimDirection, setClaimDirection] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [error, setError] = useState<string>("")

  // Check if any configuration has been started
  const hasStartedConfig = numSamples || claimType || csvData || manualData1

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

    if (numSamples === "1") {
      // Convert comma/space separated values to CSV format
      const values = manualData1
        .split(/[,\s]+/)
        .filter((val) => val.trim() !== "")
        .map((val) => val.trim())
      return values.join("\n")
    } else {
      // Two samples - convert to two-column CSV
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

  const handleSubmit = async () => {
    const finalCsvData = convertManualDataToCsv()

    if (!numSamples || !claimType || !finalCsvData || !claimDirection) {
      setError("Please fill in all required fields")
      return
    }

    // Validate manual data if using manual input
    if (dataInputMethod === "manual") {
      if (!manualData1.trim()) {
        setError("Please enter data for sample 1")
        return
      }
      if (numSamples === "2" && !manualData2.trim()) {
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
          numSamples: Number.parseInt(numSamples),
          claimType: Number.parseInt(claimType),
          pValue: Number.parseFloat(pValue),
          csvData: finalCsvData,
          isKnown,
          hypothesizedValue: Number.parseFloat(hypothesizedValue),
          knownParam: knownParam ? Number.parseFloat(knownParam) : null,
          knownParam2: knownParam2 ? Number.parseFloat(knownParam2) : null,
          claimDirection,
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
    setNumSamples("")
    setClaimType("")
    setPValue("0.05")
    setDataInputMethod("csv")
    setCsvData("")
    setManualData1("")
    setManualData2("")
    setIsKnown("")
    setHypothesizedValue("")
    setKnownParam("")
    setKnownParam2("")
    setClaimDirection("")
    setResult(null)
    setError("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2">Statistical Hypothesis Testing</h1>
          <p className="text-lg text-muted-foreground">
            Perform comprehensive hypothesis tests using our Python-powered web service
          </p>
        </div>

        {/* Main Layout */}
        <div
          className={`transition-all duration-500 ${hasStartedConfig ? "grid lg:grid-cols-3 gap-8" : "flex justify-center"}`}
        >
          {/* Main Configuration Panel */}
          <div className={`transition-all duration-500 ${hasStartedConfig ? "lg:col-span-2" : "max-w-2xl w-full"}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Test Configuration
                  {hasStartedConfig && <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />}
                </CardTitle>
                <CardDescription>Configure your hypothesis test parameters and input your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Number of Samples */}
                <div className="space-y-2">
                  <Label htmlFor="numSamples">Number of Samples *</Label>
                  <Select value={numSamples} onValueChange={setNumSamples}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of samples" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Sample</SelectItem>
                      <SelectItem value="2">2 Samples</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Claim Type */}
                <div className="space-y-2">
                  <Label htmlFor="claimType">What is your claim about? *</Label>
                  <Select value={claimType} onValueChange={setClaimType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Mean (μ)</SelectItem>
                      <SelectItem value="2">Standard Deviation (σ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* P-Value */}
                <div className="space-y-2">
                  <Label htmlFor="pValue">Significance Level (α)</Label>
                  <Input
                    id="pValue"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={pValue}
                    onChange={(e) => setPValue(e.target.value)}
                    placeholder="0.05"
                  />
                </div>

                {/* Data Input Method Selection */}
                <div className="space-y-3">
                  <Label>Data Input Method *</Label>
                  <RadioGroup value={dataInputMethod} onValueChange={setDataInputMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="csv" id="csv-method" />
                      <Label htmlFor="csv-method" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload CSV File
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual-method" />
                      <Label htmlFor="manual-method" className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4" />
                        Enter Data Manually
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Data Input Section */}
                {dataInputMethod === "csv" ? (
                  <div className="space-y-2">
                    <Label htmlFor="csvFile">Upload CSV Data *</Label>
                    <div className="flex items-center gap-4">
                      <Input id="csvFile" type="file" accept=".csv" onChange={handleFileUpload} className="flex-1" />
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {csvData && (
                      <div className="mt-2">
                        <Label>Data Preview:</Label>
                        <Textarea
                          value={csvData.slice(0, 200) + (csvData.length > 200 ? "..." : "")}
                          readOnly
                          className="mt-1 h-20 text-sm"
                        />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      For 1 sample: Upload a CSV with one column of values.
                      <br />
                      For 2 samples: Upload a CSV with two columns (sample 1 in first column, sample 2 in second
                      column).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="manualData1">{numSamples === "1" ? "Sample Data" : "Sample 1 Data"} *</Label>
                      <Textarea
                        id="manualData1"
                        value={manualData1}
                        onChange={(e) => setManualData1(e.target.value)}
                        placeholder="Enter numbers separated by commas or spaces (e.g., 1.2, 3.4, 5.6, 7.8)"
                        className="h-24"
                      />
                    </div>

                    {numSamples === "2" && (
                      <div className="space-y-2">
                        <Label htmlFor="manualData2">Sample 2 Data *</Label>
                        <Textarea
                          id="manualData2"
                          value={manualData2}
                          onChange={(e) => setManualData2(e.target.value)}
                          placeholder="Enter numbers separated by commas or spaces (e.g., 2.1, 4.3, 6.5, 8.7)"
                          className="h-24"
                        />
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">
                      Enter your data values separated by commas or spaces. Example: 1.2, 3.4, 5.6, 7.8
                    </p>
                  </div>
                )}

                {/* Conditional Fields Based on Claim Type */}
                {claimType && (
                  <>
                    {/* Known Parameter Question */}
                    <div className="space-y-3">
                      <Label>
                        {claimType === "1"
                          ? "Is the population standard deviation known?"
                          : "Is the population mean known?"}{" "}
                        *
                      </Label>
                      <RadioGroup value={isKnown} onValueChange={setIsKnown}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="known-yes" />
                          <Label htmlFor="known-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="known-no" />
                          <Label htmlFor="known-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Hypothesized Value */}
                    <div className="space-y-2">
                      <Label htmlFor="hypothesizedValue">
                        {claimType === "1"
                          ? `Hypothesized Mean (μ₀)${numSamples === "2" ? " (difference)" : ""} *`
                          : "Hypothesized Standard Deviation (σ₀) *"}
                      </Label>
                      <Input
                        id="hypothesizedValue"
                        type="number"
                        step="any"
                        value={hypothesizedValue}
                        onChange={(e) => setHypothesizedValue(e.target.value)}
                        placeholder={claimType === "1" ? "Enter μ₀" : "Enter σ₀"}
                      />
                    </div>

                    {/* Known Parameter Values */}
                    {isKnown === "yes" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="knownParam">
                            {claimType === "1"
                              ? `Known Population Standard Deviation${numSamples === "2" ? " (Sample 1)" : ""} *`
                              : `Known Population Mean${numSamples === "2" ? " (Sample 1)" : ""} *`}
                          </Label>
                          <Input
                            id="knownParam"
                            type="number"
                            step="any"
                            value={knownParam}
                            onChange={(e) => setKnownParam(e.target.value)}
                            placeholder={claimType === "1" ? "Enter σ" : "Enter μ"}
                          />
                        </div>

                        {numSamples === "2" && (
                          <div className="space-y-2">
                            <Label htmlFor="knownParam2">
                              {claimType === "1"
                                ? "Known Population Standard Deviation (Sample 2) *"
                                : "Known Population Mean (Sample 2) *"}
                            </Label>
                            <Input
                              id="knownParam2"
                              type="number"
                              step="any"
                              value={knownParam2}
                              onChange={(e) => setKnownParam2(e.target.value)}
                              placeholder={claimType === "1" ? "Enter σ₂" : "Enter μ₂"}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Claim Direction */}
                    <div className="space-y-3">
                      <Label>
                        {claimType === "1"
                          ? `What is the claim about the mean${numSamples === "2" ? " difference" : ""}? *`
                          : `What is the claim about the standard deviation${numSamples === "2" ? "s" : ""}? *`}
                      </Label>
                      <RadioGroup value={claimDirection} onValueChange={setClaimDirection}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="greater" id="greater" />
                          <Label htmlFor="greater">Greater than (≥)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="less" id="less" />
                          <Label htmlFor="less">Less than (≤)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="equal" id="equal" />
                          <Label htmlFor="equal">Equal to (=)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running Test...
                      </>
                    ) : (
                      "Run Hypothesis Test"
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel - Only show when configuration has started */}
          {hasStartedConfig && (
            <div className="space-y-6 transition-all duration-500 animate-in slide-in-from-right">
              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Results Display */}
              {result && (
                <Card>
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
                  <CardContent>
                    <div className="space-y-4">
                      <div
                        className={`p-4 rounded-lg ${
                          result.conclusion.includes("Reject")
                            ? "bg-destructive/10 border border-destructive/20"
                            : "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                        }`}
                      >
                        <h3 className="font-semibold text-lg mb-2">Conclusion:</h3>
                        <p className="text-lg">{result.conclusion}</p>
                      </div>

                      {result.details && (
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="font-semibold mb-3">Test Details:</h3>
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            {result.details.test_type && (
                              <div className="flex justify-between">
                                <span className="font-medium">Test Type:</span>
                                <span>{result.details.test_type}</span>
                              </div>
                            )}
                            {result.details.test_statistic !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Test Statistic:</span>
                                <span>{result.details.test_statistic.toFixed(4)}</span>
                              </div>
                            )}
                            {result.details.critical_value !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Critical Value:</span>
                                <span>{result.details.critical_value.toFixed(4)}</span>
                              </div>
                            )}
                            {result.details.sample_size && (
                              <div className="flex justify-between">
                                <span className="font-medium">Sample Size:</span>
                                <span>{result.details.sample_size}</span>
                              </div>
                            )}
                            {result.details.sample_mean !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Sample Mean:</span>
                                <span>{result.details.sample_mean.toFixed(4)}</span>
                              </div>
                            )}
                            {result.details.sample_std !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Sample Std Dev:</span>
                                <span>{result.details.sample_std.toFixed(4)}</span>
                              </div>
                            )}
                            {result.details.sample_size1 && (
                              <div className="flex justify-between">
                                <span className="font-medium">Sample 1 Size:</span>
                                <span>{result.details.sample_size1}</span>
                              </div>
                            )}
                            {result.details.sample_size2 && (
                              <div className="flex justify-between">
                                <span className="font-medium">Sample 2 Size:</span>
                                <span>{result.details.sample_size2}</span>
                              </div>
                            )}
                            {result.details.sample_mean1 !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Sample 1 Mean:</span>
                                <span>{result.details.sample_mean1.toFixed(4)}</span>
                              </div>
                            )}
                            {result.details.sample_mean2 !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Sample 2 Mean:</span>
                                <span>{result.details.sample_mean2.toFixed(4)}</span>
                              </div>
                            )}
                            {result.details.sample_variance1 !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Sample 1 Variance:</span>
                                <span>{result.details.sample_variance1.toFixed(4)}</span>
                              </div>
                            )}
                            {result.details.sample_variance2 !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Sample 2 Variance:</span>
                                <span>{result.details.sample_variance2.toFixed(4)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Configuration Summary */}
              {(numSamples || claimType) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Configuration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {numSamples && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Samples:</span>
                        <span>{numSamples}</span>
                      </div>
                    )}
                    {claimType && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Testing:</span>
                        <span>{claimType === "1" ? "Mean" : "Standard Deviation"}</span>
                      </div>
                    )}
                    {pValue && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Alpha (α):</span>
                        <span>{pValue}</span>
                      </div>
                    )}
                    {claimDirection && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Direction:</span>
                        <span className="capitalize">{claimDirection}</span>
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
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Python Web Service Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Powered by scipy.stats</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
