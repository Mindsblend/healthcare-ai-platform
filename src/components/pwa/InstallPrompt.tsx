'use client'

import { useState, useEffect, useCallback } from 'react'

export type InstallPromptState = {
  isInstallable: boolean
  isIOS: boolean
  isStandalone: boolean
  dismissed: boolean
}

export function useInstallPrompt() {
  const [state, setState] = useState<InstallPromptState>({
    isInstallable: false,
    isIOS: false,
    isStandalone: false,
    dismissed: false,
  })

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true

    setState((prev) => ({ ...prev, isIOS, isStandalone }))

    if (isStandalone) return

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setState((prev) => ({ ...prev, isInstallable: true }))
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setState((prev) => ({ ...prev, isInstallable: false }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setState((prev) => ({ ...prev, isInstallable: false }))
      return true
    }

    return false
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, dismissed: true }))
  }, [])

  const resetDismiss = useCallback(() => {
    setState((prev) => ({ ...prev, dismissed: false }))
  }, [])

  return {
    ...state,
    install,
    dismiss,
    resetDismiss,
    canInstall: state.isInstallable && !state.dismissed && !state.isStandalone,
    showIOSInstructions: state.isIOS && !state.isStandalone && !state.dismissed,
  }
}

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  }
}