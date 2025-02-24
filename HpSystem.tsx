'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { FileUpload } from './FileUpload'
import useSound from 'use-sound'

export default function HpSystem() {
  const [hp, setHp] = useState(() => {
    // Recuperar HP del localStorage
    if (typeof window !== 'undefined') {
      const savedHp = localStorage.getItem('hp')
      return savedHp ? parseInt(savedHp) : 100
    }
    return 100
  })
  
  const [spriteUrl, setSpriteUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('spriteImage') || '/placeholder.svg'
    }
    return '/placeholder.svg'
  })
  
  // Sonidos
  const [playPositive] = useSound('/sounds/positive.mp3')
  const [playNegative] = useSound('/sounds/negative.mp3')
  const [playPower] = useSound('/sounds/power.mp3')

  // Guardar HP en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('hp', hp.toString())
  }, [hp])

  const updateHP = (value: number, type: Action['type']) => {
    // Reproducir sonido según el tipo de acción
    if (type === 'positive') playPositive()
    else if (type === 'negative') playNegative()
    else if (type === 'power') playPower()

    setHp((prev) => {
      const newHp = Math.min(Math.max(prev + value, 0), 100)
      return newHp
    })
    
    setMood(value > 0 ? "happy" : "sad")
    
    // Mostrar notificación
    const notification = new Notification("HP Actualizado", {
      body: `${value > 0 ? '+' : ''}${value} HP`,
      icon: spriteUrl
    })
    
    setTimeout(() => setMood("neutral"), 1000)
  }

  // Solicitar permiso para notificaciones
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const [mood, setMood] = useState('neutral')

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-6">
      <div className="max-w-2xl mx-auto relative">
        <FileUpload onSpriteLoad={setSpriteUrl} />
        
        <div className="pt-32 flex flex-col items-center">
          <div
            className={cn(
              "w-64 h-64 bg-contain bg-center bg-no-repeat transition-all duration-300",
              {
                "scale-110 brightness-110 animate-bounce": mood === "happy",
                "scale-95 brightness-90 animate-shake": mood === "sad",
              }
            )}
          >
            <img
              src={spriteUrl}
              alt="Character sprite"
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* ... (resto del JSX) */}
        </div>
      </div>
    </div>
  )
} 