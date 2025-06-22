import React from 'react'
import { AdDetails as AdDetailsType } from '@/types/adDetails'

interface AdDetailsProps {
  adDetails: AdDetailsType
}

const AdDetails = ({ adDetails }: AdDetailsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-semibold text-primary-color">{adDetails.title}</h1>
            <button className="text-secondary-gray hover:text-primary-accent">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <div className="text-3xl font-bold text-primary-accent mb-4">{adDetails.price} QAR</div>
          
          <div className="flex items-center space-x-4 text-sm text-secondary-gray mb-6">
            <span>{adDetails.timeAgo}</span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {adDetails.views.toLocaleString()}
            </span>
          </div>

          {/* Category Tags Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <div className="bg-primary-bg rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-secondary-gray mb-1">Category</div>
              <div className="font-medium text-primary-color">{adDetails.category}</div>
            </div>
            {adDetails.extraInfo.map((info, index) => (
            <div key={index} className="bg-primary-bg rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-secondary-gray mb-1">{info.name}</div>
              <div className="font-medium text-primary-color">{info.value}</div>
            </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-primary-color">Description</h2>
            <p className="text-foreground leading-relaxed">{adDetails.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-primary-accent text-primary-accent rounded-lg hover:bg-light-blue">
              <span>{adDetails.likes}</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-secondary-gray border border-secondary-gray rounded-lg hover:bg-primary-bg">
              <span>Report</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </button>
          </div>
        </div>
  )
}

export default AdDetails