import styles from '../styles/Header.module.css'

import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faAngleLeft,
    faAngleRight,
    faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

const Header = ({ 
    month, 
    year,
    isPreviousMonthDisabled,
    isNextMonthDisabled,
    onPreviousMonthClick,
    onNextMonthClick,
    darkThemeEnabled,
    changeTheme,
    profileImage,
    userName
}) => {
    const [submenuVisible, setSubmenuVisible] = useState(false)

    return (
        <header className={`h-20 w-full px-8 fixed top-0 flex items-center border-none z-50 glass-bg ${styles.sideMenu}`}>
            <div className='container mx-auto flex items-center gap-4'>
                <div className='grow relative'>
                    <button onClick={() => setSubmenuVisible(!submenuVisible)}>
                        <Image
                            src={profileImage}
                            alt="Avatar"
                            width={50}
                            height={50}
                            className='rounded-full'
                        />
                    </button>

                    {
                        submenuVisible && 
                            <div className={`p-4 absolute -bottom-24 left-0 ${styles.subMenu}`}>
                                <p className='mb-2'> {userName.first} {userName.last} </p>
                                <button className='flex items-center gap-2' onClick={() => signOut()}>
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                    Logout
                                </button>
                            </div>
                    }
                </div>

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
        </header>
    )
}

export default Header