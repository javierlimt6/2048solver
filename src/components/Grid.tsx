"use client"

import { useMemo } from "react"

interface GridProps {
  matrix: number[][]
}

export function Grid({ matrix }: GridProps) {
  const colorMap = useMemo(
    () => ({
      0: "bg-gray-200",
      2: "bg-yellow-100 text-gray-800",
      4: "bg-yellow-200 text-gray-800",
      8: "bg-orange-200 text-white",
      16: "bg-orange-300 text-white",
      32: "bg-orange-400 text-white",
      64: "bg-orange-500 text-white",
      128: "bg-yellow-300 text-white",
      256: "bg-yellow-400 text-white",
      512: "bg-yellow-500 text-white",
      1024: "bg-yellow-600 text-white",
      2048: "bg-yellow-700 text-white",
    }),
    [],
  )

  const getFontSize = (value: number) => {
    if (value >= 1000) return "text-xl md:text-2xl"
    if (value >= 100) return "text-2xl md:text-3xl"
    return "text-3xl md:text-4xl"
  }

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto">
      {matrix.flat().map((value, index) => {
        const bgColor = colorMap[value as keyof typeof colorMap] || "bg-gray-800 text-white"
        return (
          <div
            key={index}
            className={`${bgColor} aspect-square flex items-center justify-center rounded-lg shadow-md transition-all duration-200`}
          >
            <span className={`${getFontSize(value)} font-bold`}>{value !== 0 && value}</span>
          </div>
        )
      })}
    </div>
  )
}

