import styles from '../styles/NumberBox.module.css'

import NumberBoxComparison from './NumberBoxComparison'

const NumberBox = ({ title, value, previousValue, positiveComparisonBad, icon, hasEuroSymbol }) => {
    const previousMonthComparison = previousValue 
        ? Math.abs(value) - Math.abs(previousValue)
        : 0

    return (
        <div className={`${styles.numberBox} w-72 h-28 px-4 py-4 rounded-md shadow-md hover:shadow-lg relative flex flex-col justify-center items-start`}>
            <p className='text-2xl'>{value} {hasEuroSymbol && '€'} </p>

            <div className="flex items-center justify-between"> 
                <span className={styles.numberBoxTitle}> {title} </span>

                <div className="rounded-full text-2xl absolute top-[50%] -translate-y-[50%] right-4 bg-slate-100 dark:bg-slate-700 w-14 h-14 flex items-center justify-center">
                    {icon} 
                </div>
            </div>

            {
                previousMonthComparison != 0 && (
                    <div className='mt-3 text-sm'>
                        <NumberBoxComparison
                            previousMonthComparison={previousMonthComparison}
                            positiveComparisonBad={positiveComparisonBad}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default NumberBox