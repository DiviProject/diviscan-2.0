import Header from '../components/Header'
import Search from '../components/Search'
import { useRouter } from 'next/router'
import { useTable, usePagination } from 'react-table'
import moment from 'moment'

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
            initialState: { pageIndex: 0 }
        },
        usePagination
      )

    return (
        <div>
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getFooterGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
    return number / 1000000000
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
                    {
                        Header: 'Datetime',
                        accessor: 'time'
                    },
                    {
                        Header: 'TXID',
                        accessor: 'txid'
                    },
                    {
                        Header: 'Block',
                        accessor: 'block'
                    },
                    {
                        Header: 'Confirmations',
                        accessor: 'confirmations'
                    },
                    {
                        Header: 'Size',
                        accessor: 'size'
                    },
                    {
                        Header: 'Amount',
                        accessor: 'value'
                    }
                ]
            }
        ],
        []
    )
    props.data.transaction_info.map(info => {
        data = {
            time: moment.unix(info.result.time).format('ddd MM/YY HH:mm'),
            txid: info.result.txid,
            block: info.result.height,
            confirmations: info.result.confirmations,
            size: info.result.size,
            outputs: info.result.vout
        }
        if (data.outputs) {
            data.outputs.map(output => {
                const addresses = output.scriptPubKey.addresses
                if (addresses !== undefined && slug == addresses) {
                    let tableData = {
                        time: data.time,
                        txid: <a href={`/tx?transaction=${data.txid}`}>{data.txid}</a>,
                        block: data.height,
                        confirmations: data.confirmations,
                        size: data.size,
                        outputs: data.vout,
                        value: output.value
                    }
                    dataArray.push(tableData)
                }
            })
        }
    })
    
    
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
    const data = await info.json()
    return {
        data: data
    }
}

export default Address