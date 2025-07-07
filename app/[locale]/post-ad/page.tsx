'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, X, Send } from 'lucide-react'
import type { ExtraInfo } from '@/types/extraInfo'
import WatermarkedImage from '@/components/WatermarkedImage'

interface FormData {
  title: string
  description: string
  subcategoryId: string
  price: number | ''
  locationId: string
  images: string[]
  extraInfo: ExtraInfo[]
}

const PostAdPage = () => {
  const t = useTranslations()
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    subcategoryId: '',
    price: '',
    locationId: '',
    images: [],
    extraInfo: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Subcategory-specific extra information fields
  const subcategoryExtraFields: Record<string, string[]> = {
    cars: ['carModel', 'carYear', 'carColor', 'carKilometers', 'carCondition', 'carFuelType'],
    motorcycles: ['carModel', 'carYear', 'carColor', 'carKilometers', 'carCondition'],
    propertiesForRent: ['propertyArea', 'propertyRooms', 'propertyBathrooms', 'propertyFurnished', 'propertyFloor'],
    propertiesForSale: ['propertyArea', 'propertyRooms', 'propertyBathrooms', 'propertyFloor'],
    jobVacancies: ['jobTitle', 'jobExperience', 'jobSalary', 'jobType', 'companyName'],
    mobiles: ['phoneModel', 'phoneBrand', 'phoneStorage', 'phoneCondition', 'phoneColor'],
    electronics: ['electronicsBrand', 'electronicsModel', 'electronicsCondition', 'electronicsWarranty'],
    others: []
  }

  // Available Locations
  const locations = [
    { key: 'Riyadh', value: t('locations.Riyadh') },
    { key: 'Jeddah', value: t('locations.Jeddah') },
    { key: 'Mecca', value: t('locations.Mecca') },
    { key: 'Medina', value: t('locations.Medina') },
  ]

  // Available subcategories (simplified - in real app would be dynamic based on category)
  const subcategories = [
    { key: 'propertiesForRent', value: t('subCategories.propertiesForRent') },
    { key: 'propertiesForSale', value: t('subCategories.propertiesForSale') },
    { key: 'cars', value: t('subCategories.cars') },
    { key: 'motorcycles', value: t('subCategories.motorcycles') },
    { key: 'mobiles', value: t('subCategories.mobiles') },
    { key: 'electronics', value: t('subCategories.electronics') },
    { key: 'jobVacancies', value: t('subCategories.jobVacancies') },
    { key: 'others', value: t('subCategories.others') }
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }

    // If subcategory is changed, update extra info fields
    if (field === 'subcategoryId' && value) {
      const extraFields = subcategoryExtraFields[value] || []
      const newExtraInfo = extraFields.map(fieldKey => ({
        name: fieldKey,
        value: ''
      }))
      
      setFormData(prev => ({
        ...prev,
        extraInfo: newExtraInfo
      }))
    }
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && formData.images.length < 10) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, e.target!.result as string]
            }))
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const getFieldDisplayName = (fieldKey: string) => {
    // Check if it's a predefined field
    if (t.raw(`extraFields.${fieldKey}`)) {
      return t(`extraFields.${fieldKey}`)
    }
    return fieldKey
  }

  const updateExtraInfo = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      extraInfo: prev.extraInfo.map((info, i) => 
        i === index ? { ...info, [field]: value } : info
      )
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) newErrors.title = t('postAd.required')
    if (!formData.description.trim()) newErrors.description = t('postAd.required')
    if (!formData.subcategoryId) newErrors.subcategory = t('postAd.required')
    if (formData.price === '' || formData.price <= 0) newErrors.price = t('postAd.required')
    if (!formData.locationId) newErrors.location = t('postAd.required')
    if (formData.images.length === 0) newErrors.images = t('postAd.required')

    // Validate required extra info fields for the selected subcategory
    const requiredExtraFields = subcategoryExtraFields[formData.subcategoryId] || []
    requiredExtraFields.forEach(fieldKey => {
      const field = formData.extraInfo.find(info => info.name === fieldKey)
      if (!field || !field.value.trim()) {
        newErrors[`extraInfo_${fieldKey}`] = `${getFieldDisplayName(fieldKey)} is required`
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, you would make an API call here
      console.log('Form data:', formData)
      
      alert(t('postAd.success'))
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subcategoryId: '',
        price: '',
        locationId: '',
        images: [],
        extraInfo: []
      })
      
    } catch {
      alert(t('postAd.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-color mb-2">
            {t('postAd.pageTitle')}
          </h1>
          <p className="text-secondary-gray">
            {t('postAd.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Ad Details Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-color mb-6">
              {t('postAd.adDetails')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('postAd.addTitle')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={t('postAd.titlePlaceholder')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('postAd.subcategory')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subcategoryId}
                  onChange={(e) => handleInputChange('subcategoryId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
                    errors.subcategoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">{t('postAd.selectCategory')}</option>
                  {subcategories.map(sub => (
                    <option key={sub.key} value={sub.key}>{sub.value}</option>
                  ))}
                </select>
                {errors.subcategoryId && <p className="text-red-500 text-sm mt-1">{errors.subcategoryId}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('postAd.price')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder={t('postAd.pricePlaceholder')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Location */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('postAd.location')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.locationId}
                  onChange={(e) => handleInputChange('locationId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${ 
                    errors.locationId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">{t('postAd.selectLocation')}</option>  
                  {locations.map(loc => (
                    <option key={loc.key} value={loc.key}>{loc.value}</option>
                  ))}
                </select>
                {errors.locationId && <p className="text-red-500 text-sm mt-1">{errors.locationId}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('postAd.description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('postAd.descriptionPlaceholder')}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-color mb-6">
              {t('postAd.images')} <span className="text-red-500">*</span>
            </h2>
            
            {/* Image Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary-accent bg-light-blue' 
                  : errors.images ? 'border-red-500' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto w-12 h-12 text-secondary-gray mb-4" />
              <p className="text-gray-600 mb-2">{t('postAd.dragImages')}</p>
              <p className="text-sm text-secondary-gray mb-4">{t('postAd.maxImages')}</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-primary-color text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer inline-block"
              >
                {t('postAd.uploadImages')}
              </label>
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <WatermarkedImage
                      src={image}
                      alt={`Preview ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-24 object-cover rounded-lg"
                      watermarkPosition="bottom-right"
                      watermarkSize="small"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Extra Information Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-primary-color">
                {t('postAd.extraInfo')}
              </h2>
            </div>

            {!formData.subcategoryId && (
              <p className="text-secondary-gray text-center py-8">
                {t('postAd.selectSubcategoryFirst')}
              </p>
            )}

            {formData.extraInfo.length > 0 && (
              <div className="space-y-4">
                {formData.extraInfo.map((info, index) => {
                  const isPredefinedField = subcategoryExtraFields[formData.subcategoryId]?.includes(info.name)
                  
                  return (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {getFieldDisplayName(info.name)} {isPredefinedField && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          value={info.value}
                          onChange={(e) => updateExtraInfo(index, 'value', e.target.value)}
                          placeholder={isPredefinedField 
                            ? `Enter ${getFieldDisplayName(info.name).toLowerCase()}` 
                            : t('postAd.infoValue')
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${
                            errors[`extraInfo_${info.name}`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`extraInfo_${info.name}`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`extraInfo_${info.name}`]}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('postAd.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-primary-color text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('postAd.publish')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostAdPage