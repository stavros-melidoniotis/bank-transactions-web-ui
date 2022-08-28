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
  faAnglesDown,
  faPiggyBank
} from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'

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

  const transactionsMonthAndYear = transactions.map((transaction, index) => ({
    index: index,
    month: months[transaction.month],
    year: transaction.year
  }))

  const [darkThemeEnabled, setDarkThemeEnabled] = useState(true)
  const [transactionsIndex, setTransactionsIndex] = useState(transactions.length - 1)

  const selectedMonth = transactions[transactionsIndex].month
  const selectedYear = transactions[transactionsIndex].year
  const transactionsToShow = transactions.filter(transaction => transaction.month === selectedMonth && transaction.year === selectedYear)[0]
  const transactionsToCompare = transactionsIndex === 0 ? null : transactions.filter(transaction => transaction.month === transactions[transactionsIndex - 1].month)[0]

  const totalDaysInSelectedMonth = new Date(transactionsToShow.year, transactionsToShow.month, 0).getDate()
  const totalTransactionsPerDayOfMonth = {}

  for (let i = 1; i <= totalDaysInSelectedMonth; i++) {
    const day = i < 10 ? `0${i}` : i
    const month = transactionsToShow.month < 10 ? `0${transactionsToShow.month}` : transactionsToShow.month

    totalTransactionsPerDayOfMonth[`${day}/${month}/${selectedYear}`] = 0
  }

  for (const transaction of transactionsToShow.transactions) {
    totalTransactionsPerDayOfMonth[transaction.date]++
  }

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

  const getDataByIndex = index => {
    setTransactionsIndex(index)
  }

  const changeTheme = () => {
    setDarkThemeEnabled(!darkThemeEnabled)
  }

  useEffect(() => {
    const html = document.documentElement

    if (darkThemeEnabled) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [darkThemeEnabled])

  return (
    <div className='relative'>
      <Header
        currentIndex={transactionsIndex}
        transactionsMonthAndYear={transactionsMonthAndYear}
        getDataByIndex={getDataByIndex}
        selectedMonth={months[selectedMonth]}
        selectedYear={selectedYear}
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
        <div className='flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-8'>
          <div className='hidden lg:block w-72 h-28 p-4'>
            <h1 className='text-3xl'> {months[selectedMonth]} {selectedYear} analytics </h1>
          </div>

          <NumberBox
            title='Transactions'
            value={Math.ceil(transactionsToShow.total_transactions)}
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
            title='Profit'
            value={(transactionsToShow.total_income + transactionsToShow.total_expenses).toFixed(2)}
            previousValue={transactionsToCompare ? (transactionsToCompare?.total_income + transactionsToCompare?.total_expenses).toFixed(2) : null}
            positiveComparisonBad={false}
            icon={<FontAwesomeIcon icon={faPiggyBank} />}
            hasEuroSymbol={true}
          />
        </div>

        <section className='diagrams mt-16 flex flex-col gap-4 w-full'>
          <div className='inline-flex flex-col lg:flex-row gap-4'>
            <ChartContainer
              id='barChart'
              title="Transactions per category"
              options={{
                chart: {
                  foreColor: darkThemeEnabled ? '#fff' : '#000',
                  toolbar: {
                    show: false
                  },
                  dropShadow: {
                    enabled: true
                  }
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
              id='pieChart'
              title="Expenses per category"
              options={{
                chart: {
                  dropShadow: {
                    enabled: true
                  }
                },
                labels: Object.keys(transactionsToShow.total_expenses_per_category),
                legend: {
                  position: 'bottom',
                  labels: {
                    colors: darkThemeEnabled ? '#fff' : '#000'
                  }
                },
                tooltip: {
                  y: {
                    formatter: val => {
                      return `-${val} €`
                    }
                  }
                },
              }}
              series={Object.values(transactionsToShow.total_expenses_per_category).map(value => Math.abs(value))}
              type="pie"
            />
          </div>

          <div className='inline-flex flex-col items-center lg:flex-row-reverse lg:justify-between gap-4'>
            {transactionsToCompare && (
              <ChartContainer
                id='mixedChart'
                title="Transactions per category (compared to prev. month)"
                options={{
                  chart: {
                    foreColor: darkThemeEnabled ? '#fff' : '#000',
                    toolbar: {
                      show: false
                    },
                    dropShadow: {
                      enabled: true
                    }
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

            <div className={`flex flex-col md:flex-row ${transactionsToCompare ? 'lg:flex-col' : ''} my-8 gap-4 items-center justify-center grow`}>
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
          </div>

          <div className='inline-flex'>
            <ChartContainer
              id='heatmapChart'
              title="Total transactions per day of month"
              options={{
                chart: {
                  foreColor: darkThemeEnabled ? '#fff' : '#000',
                  toolbar: {
                    show: false
                  },
                },
                tooltip: {
                  theme: darkThemeEnabled ? 'dark' : 'light',
                },
              }}
              series={[
                {
                  name: "Count",
                  data: Object.entries(totalTransactionsPerDayOfMonth).map(entry => ({ x: entry[0], y: entry[1] }))
                },
              ]}
              type='heatmap'
              height='150px'
              fullWidth={true}
            />
          </div>

          <div className='inline-flex'>
            <ChartContainer
              id='areaChart'
              title="Expenses, Income & Profit"
              options={{
                chart: {
                  foreColor: darkThemeEnabled ? '#fff' : '#000',
                  toolbar: {
                    show: false
                  },
                  dropShadow: {
                    enabled: true
                  }
                },
                xaxis: {
                  categories: transactions.map(transaction => `${months[transaction.month]} ${transaction.year}`),
                },
                tooltip: {
                  theme: 'dark'
                },
                dataLabels: {
                  style: {
                    fontSize: '16px'
                  },
                  formatter: val => {
                    return `${val} €`
                  },
                },
                legend: {
                  position: 'top',
                  horizontalAlign: 'right'
                }
              }}
              series={[
                {
                  name: 'Expenses',
                  type: 'area',
                  data: transactions.map(transaction => transaction.total_expenses)
                },
                {
                  name: 'Income',
                  type: 'area',
                  data: transactions.map(transaction => transaction.total_income)
                },
                {
                  name: 'Profit',
                  type: 'line',
                  data: transactions.map(transaction => (transaction.total_income + transaction.total_expenses).toFixed(2))
                },
              ]}
              height='500px'
              fullWidth={true}
              type='area'
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

      <Footer />
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
        transactions: transactions
          .sort((a, b) => a.month - b.month)
          .sort((a, b) => a.year - b.year),
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
