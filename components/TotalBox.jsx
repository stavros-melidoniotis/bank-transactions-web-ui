const TotalBox = ({ title, value }) => {
    return (
        <div className={`w-full h-32 px-4 py-4 rounded-md relative flex flex-col justify-center items-center glass-bg`}>
            <span className='text-2xl mb-2'>
                {
                    new Intl.NumberFormat('el-GR', { 
                        style: 'currency', 
                        currency: 'EUR' }
                    ).format(value)
                }
            </span>

            <p className=''> {title} </p>
        </div>
    )
}

export default TotalBox