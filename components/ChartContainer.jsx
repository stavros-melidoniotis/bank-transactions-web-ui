import dynamic from 'next/dynamic'

import styles from '../styles/ChartContainer.module.css'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ChartContainer = ({ id, title, options, series, type, height, fullWidth }) => {
    return (
        <div id={id} className={`px-8 pt-8 rounded-xl mb-4 glass-bg ${styles.chartContainer} ${fullWidth ? styles.fullWidth : ''}`}>
            <h2 className='font-bold mb-6'> {title} </h2>
            <Chart
                options={options}
                series={series}
                type={type}
                height={height ?? '350px'}
            />
        </div>
    )
}

export default ChartContainer