import styles from '../styles/Header.module.css'

import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faAngleLeft,
    faAngleRight,
} from '@fortawesome/free-solid-svg-icons'

const Header = ({ 
    month, 
    year,
    isPreviousMonthDisabled,
    isNextMonthDisabled,
    onPreviousMonthClick,
    onNextMonthClick,
    darkThemeEnabled,
    changeTheme,
    profileImage
}) => {
    return (
        <aside className={`h-20 w-full px-8 fixed top-0 flex items-center z-50 ${styles.sideMenu}`}>
            <div className='container mx-auto flex items-center gap-4'>
                <div className='grow'>
                    <Image
                        src={profileImage}
                        alt="Avatar"
                        width={50}
                        height={50}
                        className='rounded-full'
                    />
                </div>

                <button
                    onClick={() =>
                        signOut({
                            callbackUrl: `${window.location.origin}`
                        })
                    }
                    >Sign out</button>

                <div className='flex items-center gap-2 mr-4'>
                    <button 
                        className={`text-sm ${isPreviousMonthDisabled ? 'invisible' : ''}`}
                        onClick={isPreviousMonthDisabled ? null : onPreviousMonthClick}
                        disabled={isPreviousMonthDisabled}> 
                        <FontAwesomeIcon icon={faAngleLeft} /> 
                    </button>

                    <span> {month} {year} </span>

                    <button 
                        className={`text-sm ${isNextMonthDisabled ? 'invisible' : ''}`}
                        onClick={isNextMonthDisabled ? null : onNextMonthClick}
                        disabled={isNextMonthDisabled}> 
                        <FontAwesomeIcon icon={faAngleRight} /> 
                    </button>
                </div>

                <div>
                    <input className="darkModeToggle" type="checkbox" onClick={changeTheme} />
                </div>  
            </div>
        </aside>
    )
}

export default Header