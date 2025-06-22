'use client'
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SubCategory } from '@/types/subcategory'

const SubcategorySelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const subcategories : Omit<SubCategory,'image'>[] = [
    { id: '0', title: 'All'},
    { id: '1', title: 'Properties for Rent'},
    { id: '2', title: 'Lands'},
    { id: '3', title: 'Properties for Sale'},
    { id: '4', title: 'Furniture'},
    { id: '5', title: 'Cars'},
    { id: '6', title: 'Car Showrooms'},
    { id: '7', title: 'Motorcycles'},
    { id: '8', title: 'Car Rentals'},
    { id: '9', title: 'Offshore Tools'},
    { id: '10', title: 'Spare Parts'},
  ]

  const selectedCategoryData = subcategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        className="h-12 px-4 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors min-w-[80px] justify-center cursor-pointer"
      >
        <span className="text-sm font-medium">{selectedCategoryData?.title || 'All'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
            {subcategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selectedCategory === category.id ? 'bg-primary-accent/10 text-primary-accent' : 'text-gray-700'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SubcategorySelector