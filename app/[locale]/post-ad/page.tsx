'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Upload, X, Send } from 'lucide-react'
import WatermarkedImage from '@/components/WatermarkedImage'
import SearchableSelect from '@/components/SearchableSelect'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface FormData {
  title: string
  description: string
  categoryId: string
  price: number | ''
  locationId: string
  images: string[]
}

interface Location {
  id: string | number
  name: string
}

interface Category {
  id: string | number
  name: string
}

interface LocationOption {
  key: string
  value: string
}

const PostAdPage = () => {
  const t = useTranslations()
  const locale = useLocale()
  const { getToken } = useAuth()
  const router = useRouter()
  console.log(getToken())

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    locationId: '',
    images: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [locations, setLocations] = useState<LocationOption[]>([])
  const [categories, setCategories] = useState<LocationOption[]>([])

  // Check if user is authenticated
  useEffect(() => {
    if (!getToken()) {
      // Redirect to login page if not authenticated
      router.push(`/${locale}/login?redirect=/post-ad`)
    }
  }, [getToken, router, locale])

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://alaamohamad-001-site1.qtempurl.com/api/admin/regions/dropdown', {
          headers: {
            'Accept-Language': locale
          }
        })

        if (!response.ok) {
          console.error('Failed to fetch locations:', response.statusText)
          return
        }

        const responseData = await response.json()

        if (responseData.success && Array.isArray(responseData.data)) {
          const formattedLocations = responseData.data.map((loc: Location) => ({ key: String(loc.id), value: loc.name }))
          setLocations(formattedLocations)
        } else {
          console.error('Failed to fetch locations:', responseData.message || 'Response data is not in the expected format.')
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    fetchLocations()
  }, [locale])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://alaamohamad-001-site1.qtempurl.com/api/customer/categories/dropdown', {
          headers: {
            'Accept-Language': locale
          }
        })

        if (!response.ok) {
          console.error('Failed to fetch categories:', response.statusText)
          return
        }

        const responseData = await response.json()

        if (responseData.success && Array.isArray(responseData.data)) {
          const formattedCategories = responseData.data.map((cat: Category) => ({
            key: String(cat.id),
            value: cat.name
          }))
          setCategories(formattedCategories)
        } else {
          console.error(
            'Failed to fetch categories:',
            responseData.message || 'Response data is not in the expected format.'
          )
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [locale])

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
  }

  // Convert base64 image string to File object
  const base64ToFile = (base64String: string, index: number): File => {
    // Extract the content type and base64 data
    const contentType = base64String.split(';')[0].split(':')[1]
    const byteCharacters = atob(base64String.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: contentType })

    return new File([blob], `image-${index}.${contentType.split('/')[1]}`, { type: contentType })
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
    if (!formData.categoryId) newErrors.categoryId = t('postAd.required')
    if (formData.price === '' || formData.price <= 0) newErrors.price = t('postAd.required')
    if (!formData.locationId) newErrors.locationId = t('postAd.required')
    if (formData.images.length === 0) newErrors.images = t('postAd.required')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Check if user is authenticated
    if (!getToken()) {
      router.push(`/${locale}/login?redirect=/post-ad`)
      return
    }

    setIsLoading(true)

    try {
      // Create a FormData object to send as multipart/form-data
      const formDataToSend = new FormData()

      // Add basic fields
      formDataToSend.append('Name', formData.title)
      formDataToSend.append('Description', formData.description)
      formDataToSend.append('Price', String(formData.price))
      formDataToSend.append('CategoryId', formData.categoryId)
      formDataToSend.append('RegionId', formData.locationId)

      // Convert base64 images to files and append
      formData.images.forEach((base64Image, index) => {
        const file = base64ToFile(base64Image, index)
        formDataToSend.append('Images', file)
      })

      // Get token from localStorage
      const token = getToken()

      // Make API call
      const response = await fetch('http://alaamohamad-001-site1.qtempurl.com/api/offers/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': locale
        },
        body: formDataToSend
      })

      const responseData = await response.json()
      console.log(responseData)

      if (responseData.success) {
        // alert(t('postAd.success'))

        // Reset form
        setFormData({
          title: '',
          description: '',
          categoryId: '',
          price: '',
          locationId: '',
          images: []
        })

        // Redirect to the created offer page
        if (responseData.data && responseData.data.id) {
          router.push(`/${locale}/ad/${responseData.data.id}`)
        }
      } else {
        alert(responseData.Message || t('postAd.error'))
      }
    } catch (error) {
      console.error('Error creating offer:', error)
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('postAd.category')} <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={categories}
                  value={formData.categoryId}
                  onChange={(value) => handleInputChange('categoryId', value)}
                  placeholder={t('postAd.selectCategory')}
                  error={errors.categoryId}
                />
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('postAd.location')} <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={locations}
                  value={formData.locationId}
                  onChange={(value) => handleInputChange('locationId', value)}
                  placeholder={t('postAd.selectLocation')}
                  error={errors.locationId}
                />
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
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
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
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