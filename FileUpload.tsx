'use client'

import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { useState } from 'react'

interface FileUploadProps {
  onSpriteLoad: (imageUrl: string) => void
}

export function FileUpload({ onSpriteLoad }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        onSpriteLoad(imageUrl)
        localStorage.setItem('spriteImage', imageUrl)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Por favor sube un archivo de imagen válido')
    }
  }

  return (
    <div className="absolute right-4 top-20">
      <input
        type="file"
        id="sprite-upload"
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <label
        htmlFor="sprite-upload"
        className={`flex items-center gap-2 cursor-pointer ${
          isDragging ? 'bg-blue-600' : 'bg-blue-500'
        } hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer.files[0]
          handleFile(file)
        }}
      >
        <Upload className="w-4 h-4" />
        Subir Sprite
      </label>
    </div>
  )
} 