"use client"

import React, { useRef } from "react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

export default function Certificate({
  name,
  courseTitle,
  onClose,
}: {
  name: string
  courseTitle: string
  onClose: () => void
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  const filenameSafe = (s: string) => s.replace(/[^a-z0-9]+/gi, '_')

  const downloadSVG = () => {
    const svg = svgRef.current
    if (!svg) return
    const serializer = new XMLSerializer()
    const str = serializer.serializeToString(svg)
    const blob = new Blob([str], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filenameSafe(courseTitle)}_${filenameSafe(name)}_certificate.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const downloadPNG = async () => {
    const svg = svgRef.current
    if (!svg) return
    const serializer = new XMLSerializer()
    const str = serializer.serializeToString(svg)
    const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = svg.clientWidth || 1200
      canvas.height = svg.clientHeight || 900
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((b) => {
        if (!b) return
        const u = URL.createObjectURL(b)
        const a = document.createElement('a')
        a.href = u
        a.download = `${filenameSafe(courseTitle)}_${filenameSafe(name)}_certificate.png`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(u)
      }, 'image/png')
      URL.revokeObjectURL(url)
    }
    img.onerror = () => URL.revokeObjectURL(url)
    img.src = url
  }

  const now = new Date().toLocaleDateString()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Certificate Preview</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              <X />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="w-full">
              <div className="mx-auto w-full max-w-[1000px] bg-white p-4 md:p-8 shadow-md">
                <div className="max-h-[70vh] overflow-auto">
                  <svg
                    ref={svgRef}
                    className="w-full h-auto"
                    viewBox="0 0 1200 850"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="100%" stopColor="#fff7ed" />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  <rect x="20" y="20" width="1160" height="810" rx="18" fill="#0f172a" />
                  <rect x="40" y="40" width="1120" height="770" rx="12" fill="url(#g)" filter="url(#shadow)" />
                  <text x="600" y="140" textAnchor="middle" fontSize="36" fontFamily="Georgia, serif" fill="#7c2d12">Certificate of Completion</text>
                  <text x="600" y="210" textAnchor="middle" fontSize="22" fill="#334155">This certifies that</text>
                  <text x="600" y="280" textAnchor="middle" fontSize="44" fontWeight="700" fontFamily="'Helvetica Neue', Arial, sans-serif" fill="#0b1220">{name}</text>
                  <text x="600" y="330" textAnchor="middle" fontSize="20" fill="#334155">has successfully completed the course</text>
                  <text x="600" y="380" textAnchor="middle" fontSize="28" fontWeight="600" fill="#0b1220">{courseTitle}</text>
                  <text x="200" y="720" textAnchor="start" fontSize="16" fill="#475569">Date: {now}</text>
                  <text x="1000" y="720" textAnchor="end" fontSize="16" fill="#475569">Instructor</text>
                  <circle cx="920" cy="620" r="68" fill="#fde68a" stroke="#f59e0b" strokeWidth="6" />
                  <text x="920" y="630" textAnchor="middle" fontSize="28" fontWeight="700" fill="#92400e">✓</text>
                </svg>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3">
              <Button onClick={downloadSVG} className="flex-1">Download SVG</Button>
              <Button onClick={downloadPNG} className="flex-1">Download PNG</Button>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
