import { useState, useEffect } from 'react'

export const useScrollAnimation = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    
    document.querySelectorAll('.fade-up').forEach((el) => {
      observer.observe(el)
    })
    
    return () => observer.disconnect()
  }, [])
}
