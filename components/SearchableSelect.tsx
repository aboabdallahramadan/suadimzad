'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search } from 'lucide-react'

interface Option {
  key: string
  value: string
}

interface SearchableSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
  disabled?: boolean
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.key === value)

  const filteredOptions = options.filter(option =>
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionKey: string) => {
    onChange(optionKey)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg flex justify-between items-center text-left focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.value : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary-accent focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li
                  key={option.key}
                  onClick={() => handleSelect(option.key)}
                  className={`px-4 py-2 cursor-pointer hover:bg-light-blue ${
                    value === option.key ? 'bg-primary-accent text-white' : 'text-gray-800'
                  }`}
                >
                  {option.value}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect 