import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowTrendDown,
    faArrowTrendUp
} from '@fortawesome/free-solid-svg-icons'

const NumberBoxComparison = ({ previousMonthComparison, positiveComparisonBad, hasEuroSymbol }) => {
    let comparisonColor

    if (positiveComparisonBad && previousMonthComparison > 0) {
        comparisonColor = 'text-yellow-500 dark:text-yellow-400'
    }

    if (!positiveComparisonBad && previousMonthComparison > 0) {
        comparisonColor = 'text-green-500 dark:text-green-400'
    }

    if (positiveComparisonBad && previousMonthComparison < 0) {
        comparisonColor = 'text-green-500 dark:text-green-400'
    }

    if (!positiveComparisonBad && previousMonthComparison < 0) {
        comparisonColor = 'text-yellow-500 dark:text-yellow-400'
    }

    return (
        <div className={comparisonColor}> 
            <p className='mr-2 inline-block'>
                {previousMonthComparison > 0 ? '+' : ''}
                {previousMonthComparison.toFixed(2)} 
                {hasEuroSymbol ? ' €' : ''}
            </p>

            <FontAwesomeIcon icon={previousMonthComparison > 0 ? faArrowTrendUp : faArrowTrendDown} /> 
        </div>
    )
}

export default NumberBoxComparison