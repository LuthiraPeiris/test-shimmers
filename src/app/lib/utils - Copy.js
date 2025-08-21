import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  
  return new Date(dateString).toLocaleDateString('en-US', {
    ...defaultOptions,
    ...options,
  })
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substr(2, 5)
  return `${prefix}${timestamp}${randomPart}`.toUpperCase()
}

export const calculateAge = (birthDate) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}