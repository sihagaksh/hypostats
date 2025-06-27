"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FileUploadProps {
  onDataLoad: (data: number[][]) => void
  maxFiles?: number
}

export function FileUpload({ onDataLoad, maxFiles = 2 }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const parseCSV = (text: string): number[] => {
    const lines = text.trim().split("\n")
    const data: number[] = []

    for (const line of lines) {
      const values = line.split(",").map((val) => val.trim())
      for (const val of values) {
        const num = Number.parseFloat(val)
        if (!isNaN(num)) {
          data.push(num)
        }
      }
    }

    return data
  }

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles = Array.from(fileList).slice(0, maxFiles)
      setFiles(newFiles)

      try {
        const dataArrays: number[][] = []

        for (const file of newFiles) {
          const text = await file.text()
          const data = parseCSV(text)
          dataArrays.push(data)
        }

        onDataLoad(dataArrays)
      } catch (error) {
        console.error("Error parsing files:", error)
      }
    },
    [maxFiles, onDataLoad],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)

    // Reload data without the removed file
    if (newFiles.length > 0) {
      handleFiles(new FileList())
    } else {
      onDataLoad([])
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple={maxFiles > 1}
            accept=".csv,.txt"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drop your CSV files here, or click to browse</p>
            <p className="text-sm text-muted-foreground mb-4">
              Upload up to {maxFiles} CSV file{maxFiles > 1 ? "s" : ""} with numerical data
            </p>
            <Button variant="outline" size="sm">
              Choose Files
            </Button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Uploaded Files:</h4>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
