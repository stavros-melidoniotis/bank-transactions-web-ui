import styles from '../styles/Header.module.css'

import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faAngleLeft,
    faAngleRight,
    faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { useState, useRef } from 'react'

const Header = ({ 
    currentIndex,
    transactionsMonthAndYear,
    getDataByIndex,
    selectedMonth, 
    selectedYear,
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
    const [monthPickerVisible, setMonthPickerVisible] = useState(false)

    const transactionMonths = [...new Set(transactionsMonthAndYear.map(option => option.month))]
    const transactionYears = [...new Set(transactionsMonthAndYear.map(option => option.year))]

    const [availableMonthsToChoose, setAvailableMonthsToChoose] = useState(transactionMonths)
    const [availableYearsToChoose, setAvailableYearsToChoose] = useState(transactionYears)

    const monthDropdown = useRef(null)
    const yearDropdown = useRef(null)

    const handleMonthChange = e => {
        const newMonth = e.target.value

        const newAvailableYears = transactionsMonthAndYear
                                    .filter(option => option.month === newMonth)
                                    .map(option => option.year)

        setAvailableYearsToChoose(newAvailableYears)
    }

    const handleYearChange = e => {
        const newYear = e.target.value

        const newAvailableMonths = transactionsMonthAndYear
                                    .filter(option => option.year == newYear)
                                    .map(option => option.month)

        setAvailableMonthsToChoose(newAvailableMonths)
    }

    const handleDateSearchClick = () => {
        const chosenMonth = monthDropdown.current.value
        const chosenYear = yearDropdown.current.value

        const relatedTransactions = transactionsMonthAndYear.filter(transaction => transaction.month === chosenMonth && transaction.year == chosenYear)[0]

        getDataByIndex(relatedTransactions.index)
    }

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

                <div className='flex items-center gap-2 mr-4 relative'>
                    <button 
                        className={`text-sm ${isPreviousMonthDisabled ? 'invisible' : ''}`}
                        onClick={isPreviousMonthDisabled ? null : onPreviousMonthClick}
                        disabled={isPreviousMonthDisabled}> 
                        <FontAwesomeIcon icon={faAngleLeft} /> 
                    </button>

                    <span onClick={() => setMonthPickerVisible(!monthPickerVisible)} className='hover:cursor-pointer'> {selectedMonth} {selectedYear} </span>

                    {
                        monthPickerVisible && (
                            <div className='absolute -bottom-16 -left-16 flex gap-4 p-4'>
                                <select className='glass-bg' onChange={handleMonthChange} defaultValue={selectedMonth} ref={monthDropdown}>
                                    {transactionMonths.map((month, index) => {
                                        return (
                                            <option key={index} value={month}>  
                                                {month}
                                            </option>
                                        )
                                    })}
                                </select>

                                <select className='glass-bg' onChange={handleYearChange} defaultValue={selectedYear} ref={yearDropdown}>
                                    {transactionYears.map((year, index) => {
                                        return (
                                            <option key={index} value={year} disabled={!availableYearsToChoose.includes(year)}>  
                                                {year}
                                            </option>
                                        )
                                    })}
                                </select>

                                <button onClick={handleDateSearchClick}> Go </button>
                            </div>
                        )
                    }

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