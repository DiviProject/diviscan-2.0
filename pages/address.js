import Header from '../components/Header'
import Search from '../components/Search'
import { useRouter } from 'next/router'
import { useTable, usePagination, useSortBy } from 'react-table'
import moment from 'moment'
import * as _ from 'lodash'

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        prepareRow,
        state: { pageIndex, pageSize }
      } = useTable(
        {
            columns,
            data,
            initialState: { 
                pageIndex: 0 
            }
        },
        useSortBy,
        usePagination
      )

    return (
        <div>
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getFooterGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted
                                    ? column.isSortedDesc
                                        ? ' 🔽'
                                        : ' 🔼'
                                    : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      </div>
    )
}

const unSatoshi = (number) => {
    return number / 100000000
}

const Address = props => {
    const dataArray = []
    let data = {}
    const router = useRouter()
    const slug = router.query.address
    const columns = React.useMemo(
        () => 
        [
            {
                Header: 'Address transactions',
                columns: [
                    // {
                    //     Header: 'Datetime',
                    //     accessor: 'time'
                    // },
                    {
                        Header: 'TXID',
                        accessor: 'txid',
                        sortType: 'basic'
                    },
                    {
                        Header: 'Block',
                        accessor: 'block',
                        sortType: 'basic',
                    },
                    // {
                    //     Header: 'Confirmations',
                    //     accessor: 'confirmations'
                    // },
                    // {
                    //     Header: 'Size',
                    //     accessor: 'size'
                    // },
                    {
                        Header: 'Amount',
                        accessor: 'value',
                        sortType: 'basic'
                    }
                ]
            }
        ],
        []
    )
    
   

    const deltaInfo = props.deltas[0].result

    const getStakingRewards = () => {
        const stakes = _.groupBy(deltaInfo, 'txid')
        Object.entries(stakes).map(entry => {
            if (entry[1].length == 2) {
                entry.forEach(sat => {
                    if (sat[0].satoshis) {
                        const stakeReward = sat[0].satoshis + sat[1].satoshis
                        dataArray.push({
                            txid: <a href={`/tx?transaction=${sat[0].txid}`}>{sat[0].txid}</a>,
                            block: <a href={`/block?blockheight=${sat[0].height}`}>{sat[0].height}</a>,
                            value: unSatoshi(stakeReward)
                        })
                    } 
                })
            } 
            else {
                entry.forEach(sat => {
                    if (sat[0].satoshis) {
                        dataArray.push({
                            txid: <a href={`/tx?transaction=${sat[0].txid}`}>{sat[0].txid}</a>,
                            block: <a href={`/block?blockheight=${sat[0].height}`}>{sat[0].height}</a>,
                            value: unSatoshi(sat[0].satoshis)
                        })
                    }
                })
            }
        })
    }
    
    getStakingRewards()

    return( 
        <div>
            <Header />
            <Search />
            <p>Address: {slug}</p> 
            <p>Balance: {unSatoshi(props.data.balance_info.result.balance)}</p>
            <p>Received: {unSatoshi(props.data.balance_info.result.received)}</p>
            <Table columns = {columns} data = {dataArray} />
        </div>
    )
}

Address.getInitialProps = async function(slug) {
    const info = await fetch('https://api.diviscan.io/address/' + slug.query.address)
    const deltas = await fetch('https://api.diviscan.io/address-deltas/' + slug.query.address)
    const deltaData = await deltas.json()
    const data = await info.json()
    return {
        data: data,
        deltas: deltaData
    }
}

export default Address