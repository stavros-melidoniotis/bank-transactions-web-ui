import styles from '../styles/index.module.css'

import NumberBox from '../components/NumberBox'
import ChartContainer from '../components/ChartContainer'
import { getSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import {
  faHandHoldingDollar,
  faBagShopping,
  faCircleDollarToSlot,
  faAnglesUp,
  faAnglesDown
} from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'

export default function Home({ isConnected, transactions, session }) {
  const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  }

  const [darkThemeEnabled, setDarkThemeEnabled] = useState(true)
  const [transactionsIndex, setTransactionsIndex] = useState(transactions.length - 1)

  const selectedMonth = transactions[transactionsIndex].month
  const selectedYear = transactions[transactionsIndex].year
  const transactionsToShow = transactions.filter(transaction => transaction.month === selectedMonth)[0]
  const transactionsToCompare = transactionsIndex === 0 ? null : transactions.filter(transaction => transaction.month === transactions[transactionsIndex - 1].month)[0]

  let mixedChartSeries
  let commonTransactionCategories

  if (transactionsToCompare) {
    commonTransactionCategories = Object.keys(transactionsToShow.total_transactions_per_category).filter(key => key in transactionsToCompare.total_transactions_per_category)

    const getCommonTransactions = (currentTransactions, previousTransactions) => {
      const commonTransactionsFromCurrent = []
      const commonTransactionsFromPrevious = []

      for (const [key, value] of Object.entries(currentTransactions.total_transactions_per_category)) {
        if (!commonTransactionCategories?.includes(key)) continue

        commonTransactionsFromCurrent.push(value)
      }

      for (const [key, value] of Object.entries(previousTransactions.total_transactions_per_category)) {
        if (!commonTransactionCategories?.includes(key)) continue

        commonTransactionsFromPrevious.push(value)
      }

      return [commonTransactionsFromCurrent, commonTransactionsFromPrevious]
    }

    const [commonTransactionsFromCurrent, commonTransactionsFromPrevious] = getCommonTransactions(transactionsToShow, transactionsToCompare)

    mixedChartSeries = [{
      name: `${months[selectedMonth]} ${selectedYear}`,
      type: 'column',
      data: commonTransactionsFromCurrent
    },
    {
      name: `${months[transactionsToCompare.month]} ${transactionsToCompare.year}`,
      type: 'line',
      data: commonTransactionsFromPrevious
    }]
  }

  const getPreviousMonthData = () => {
    setTransactionsIndex(prevIndex => prevIndex - 1)
  }

  const getNextMonthData = () => {
    setTransactionsIndex(prevIndex => prevIndex + 1)
  }

  const changeTheme = () => {
    setDarkThemeEnabled(!darkThemeEnabled)
  }

  useEffect(() => {
    const html = document.documentElement
    // console.log(darkThemeEnabled);

    if (darkThemeEnabled) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // window.localStorage.setItem('bank-analytics-dark-theme', darkThemeEnabled)
  }, [darkThemeEnabled])

  // useEffect(() => {
  //   const html = document.documentElement
  //   // const prefersDarkTheme = window.localStorage.getItem('bank-analytics-dark-theme')

  //   // if (prefersDarkTheme) {
  //   //   html.classList.add('dark')
  //   // } else {
  //   //   html.classList.remove('dark')
  //   // }
  // }, [darkThemeEnabled])

  return (
    <div className='relative'>
      <Header
        month={months[selectedMonth]}
        year={selectedYear}
        isPreviousMonthDisabled={transactionsIndex === 0}
        isNextMonthDisabled={transactionsIndex === transactions.length - 1}
        onPreviousMonthClick={getPreviousMonthData}
        onNextMonthClick={getNextMonthData}
        darkThemeEnabled={darkThemeEnabled}
        changeTheme={changeTheme}
        profileImage={session.profileImage}
        userName={session.name}
      />

      <div className="absolute top-0 left-0 right-0">
        <div className="absolute top-0 overflow-visible opacity-50 dark:opacity-30 left-16">
          <div className={`mix-blend-multiply absolute w-[800px] h-[900px] rounded-[40rem] ${styles.circleObj}`}></div>
        </div>
        
        <div className="absolute overflow-visible opacity-50 dark:opacity-30 top-28 left-52">
          <div className={`mix-blend-multiply absolute w-[800px] h-[600px] rounded-[40rem] ${styles.circleObj2}`}></div>
        </div>
      </div>

      <main className='container mx-auto pt-24 relative z-40'>
        <h1 className='text-3xl my-8'> Viewing analytics of {months[selectedMonth]} {transactionsToShow.year} transactions </h1>

        <div className='flex flex-wrap justify-center md:justify-start items-center gap-6'>
          <NumberBox
            title='Transactions'
            value={transactionsToShow.total_transactions}
            previousValue={transactionsToCompare?.total_transactions}
            positiveComparisonBad={false}
            icon={<FontAwesomeIcon icon={faBagShopping} />}
            hasEuroSymbol={false}
          />

          <NumberBox
            title='Total expenses'
            value={transactionsToShow.total_expenses}
            previousValue={transactionsToCompare?.total_expenses}
            positiveComparisonBad={true}
            icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
            hasEuroSymbol={true}
          />

          <NumberBox
            title='Total income'
            value={transactionsToShow.total_income}
            previousValue={transactionsToCompare?.total_income}
            positiveComparisonBad={false}
            icon={<FontAwesomeIcon icon={faCircleDollarToSlot} />}
            hasEuroSymbol={true}
          />

          <NumberBox
            title='Max expense'
            value={transactionsToShow.max_expense}
            previousValue={transactionsToCompare?.max_expense}
            positiveComparisonBad={true}
            icon={<FontAwesomeIcon icon={faAnglesUp} />}
            hasEuroSymbol={true}
          />

          <NumberBox
            title='Min expense'
            value={transactionsToShow.min_expense}
            previousValue={transactionsToCompare?.min_expense}
            positiveComparisonBad={true}
            icon={<FontAwesomeIcon icon={faAnglesDown} />}
            hasEuroSymbol={true}
          />
        </div>

        <section className='diagrams mt-16 flex flex-col gap-4 w-full'>
          <div className='inline-flex flex-col lg:flex-row gap-4'>
            <ChartContainer
              title="Transactions per category"
              options={{
                chart: {
                  id: "bar-chart",
                  foreColor: darkThemeEnabled ? '#fff' : '#000',
                  toolbar: {
                    show: false
                  },
                },
                xaxis: {
                  categories: Object.keys(transactionsToShow.total_transactions_per_category),
                },
                tooltip: {
                  theme: 'dark'
                },
                grid: {
                  strokeDashArray: 5
                },
              }}
              series={[
                {
                  name: `${months[selectedMonth]} ${transactionsToShow.year}`,
                  data: Object.values(transactionsToShow.total_transactions_per_category)
                }
              ]}
              type='bar'
            />

            <ChartContainer
              title="Expenses per category"
              options={{
                chart: {
                  id: "pie-chart",
                },
                labels: Object.keys(transactionsToShow.total_expenses_per_category),
                legend: {
                  position: 'bottom',
                  labels: {
                    colors: darkThemeEnabled ? '#fff' : '#000'
                  }
                },
              }}
              series={Object.values(transactionsToShow.total_expenses_per_category).map(value => Math.abs(value))}
              type="pie"
            />
          </div>

          <div className='inline-flex flex-col lg:flex-row-reverse gap-4'>
            {transactionsToCompare && (
              <ChartContainer
                title="Transactions per category comparison"
                options={{
                  chart: {
                    id: "mixed-chart",
                    foreColor: darkThemeEnabled ? '#fff' : '#000',
                    toolbar: {
                      show: false
                    },
                  },
                  xaxis: {
                    categories: commonTransactionCategories,
                  },
                  tooltip: {
                    theme: 'dark'
                  },
                  grid: {
                    strokeDashArray: 5
                  },
                  markers: {
                    size: 4
                  },
                  stroke: {
                    curve: 'smooth'
                  },
                }}
                series={mixedChartSeries}
              />
            )}

            <ChartContainer
              title="Transactions per category comparison"
              options={{
                chart: {
                  id: "heatmap-chart",
                  foreColor: darkThemeEnabled ? '#fff' : '#000',
                  toolbar: {
                    show: false
                  },
                },
                tooltip: {
                  theme: darkThemeEnabled ? 'dark' : 'light',
                },
              }}
              series={[{
                name: "Series 1",
                data: [{
                  x: 'W1',
                  y: 22
                }, {
                  x: 'W2',
                  y: 29
                }, {
                  x: 'W3',
                  y: 13
                }, {
                  x: 'W4',
                  y: 32
                }]
              },
              {
                name: "Series 2",
                data: [{
                  x: 'W1',
                  y: 43
                }, {
                  x: 'W2',
                  y: 43
                }, {
                  x: 'W3',
                  y: 43
                }, {
                  x: 'W4',
                  y: 43
                }]
              }]}
              type='heatmap'
            />
          </div>
        </section>

        <section className='my-16'>
          <h2 className='font-bold mb-6'>Detailed Transactions</h2>
          <div className='h-96 overflow-y-auto p-8 rounded-xl glass-bg'>
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Comments</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {
                  transactionsToShow.transactions.map((transaction, index) =>
                    <tr key={index}>
                      <td style={{ color: 'var(--color-text-offset)' }}> {++index} </td>
                      <td>
                        <div className={`rounded-full text-2xl w-12 h-12 flex justify-center items-center ${styles.tableIcon}`}>
                          {
                            parseFloat(transaction.amount) > 0
                              ? <FontAwesomeIcon icon={faCircleDollarToSlot} />
                              : <FontAwesomeIcon icon={faHandHoldingDollar} />
                          }
                        </div>
                      </td>
                      <td> {transaction.category} </td>
                      <td> {transaction.description} </td>
                      <td> {transaction.date} </td>
                      <td> {transaction.comments} </td>
                      <td> {transaction.amount} € </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  const sessionParsed = JSON.parse(session.user.name)

  try {
    const baseUrl = process.env.NODE_ENV === 'development'
      ? process.env.DEV_URL
      : process.env.PROD_URL

    const data = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      body: JSON.stringify({ collectionName: sessionParsed.collectionName }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })

    const transactions = await data.json()

    return {
      props: {
        isConnected: true,
        transactions: transactions,
        session: sessionParsed
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
