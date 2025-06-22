import { AdComment } from '@/types/adComment'
import React from 'react'

const CommentsSection = ({adComments}: {adComments: AdComment[]}) => {
  return (
    <div>
        {/* Add Comment */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-primary-color">Add comment</h3>
          <textarea 
            placeholder="Enter comment here"
            className="w-full p-4 border border-secondary-gray rounded-lg focus:outline-none focus:border-primary-accent resize-none"
            rows={4}
          />
          <button className="mt-4 bg-primary-color text-white px-8 py-3 rounded-lg hover:bg-primary-dark w-full sm:w-auto">
            Comment
          </button>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary-color">Comments ({adComments.length})</h3>
          
          <div className="space-y-6">
            {adComments.map((comment) => (
              <div key={comment.id} className="flex space-x-4 not-last:border-b border-secondary-gray pb-4">
                <img 
                  src={comment.user.avatar} 
                  alt={comment.user.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start lg:items-center justify-between mb-2 flex-col lg:flex-row">
                    <h4 className="font-semibold text-primary-color">{comment.user.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-secondary-gray text-xs sm:text-sm">{comment.timeAgo}</span>
                    </div>
                  </div>
                  <p className="text-foreground">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default CommentsSection