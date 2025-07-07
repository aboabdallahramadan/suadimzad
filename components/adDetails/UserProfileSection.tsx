'use client'
import { Link } from '@/i18n/navigation';
import { AdUser } from '@/types/adUser'
import { useTranslations } from 'next-intl';
import WatermarkedImgTag from '../WatermarkedImgTag';
import { useState } from 'react'
import { MessageCircle } from 'lucide-react';

interface UserProfileSectionProps {
    user: AdUser
}

const UserProfileSection = ({ user }: UserProfileSectionProps) => {
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    const t = useTranslations();
    const handleShowPhoneNumber = () => {
        if (showPhoneNumber) {
            navigator.clipboard.writeText(user.phoneNumber);
        }
        else {
            setShowPhoneNumber(true);
            setTimeout(() => {
                setShowPhoneNumber(false);
            }, 3000);
        }
    }
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
                <div className="flex items-center space-x-4 flex-col lg:flex-row ">
                    <WatermarkedImgTag
                        src={user.avatar} 
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                        watermarkPosition="bottom-right"
                        watermarkSize="small"
                    />
                    <div>
                        <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg text-primary-color">{user.name}</h3>
                        <button className="text-primary-accent hover:text-primary-color text-sm">+ {t("userProfile.follow")}</button>
                        </div>
                        <p className="text-secondary-gray text-sm">{t("userProfile.memberSince")}: {user.memberSince}</p>
                    </div>
                </div>
                
                <div className="flex space-x-3">
                    <Link href={`/chat/${user.id}`} className="flex items-center space-x-2 bg-primary-color text-white p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-primary-dark">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm sm:text-base">{t("userProfile.chat")}</span>
                    </Link>
                    <button onClick={handleShowPhoneNumber} className="flex items-center space-x-2 border border-primary-accent text-primary-accent p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-light-blue">
                        <svg className={`w-5 h-5 ${showPhoneNumber ? 'hidden' : 'block'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className={`text-sm sm:text-base ${showPhoneNumber ? 'block' : 'hidden'}`}>{user.phoneNumber}</span>
                        <svg className={`w-5 h-5 ${showPhoneNumber ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span className={`text-sm sm:text-base ${showPhoneNumber ? 'hidden' : 'block'}`}>{t("userProfile.showNumber")}</span>
                    </button>
                </div>
            </div>
        </div>
)}

export default UserProfileSection