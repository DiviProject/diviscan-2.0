import Header from '../components/Header'
import Search from '../components/Search'
import { useRouter } from 'next/router'
import Link from 'next/link'
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

const Tx = props => {
    const router = useRouter()
    const slug = router.query.block
    const dataArray = []
    const outputArray = []
    props.data.vout.forEach(vout => {
        outputArray.push(vout.value)
    })
    const totalOutput = outputArray.reduce((a, b) => a + b, 0)
    const columns = React.useMemo(
        () => 
        [
            {
                Header: 'Outputs',
                columns: [
                    {
                        Header: 'Index',
                        accessor: 'index'
                    },
                    {
                        Header: 'Value',
                        accessor: 'value'
                    },
                    {
                        Header: 'Address',
                        accessor: 'address'
                    }
                ]
            }
        ]
    )  
    props.data.vout.map(info => {
        const data = {
            index: info.n,
            value: info.value,
            address: <a href={`/address?address=${info.scriptPubKey.addresses}`}>{info.scriptPubKey.addresses}</a>
        }
        dataArray.push(data)
    })

    return(
        <div>
            <Header />
            <Search />
            <h1>Details for transaction</h1>
            <p>TXID: {props.data.txid}</p>
            <p>Block height: {props.data.height}</p>
            <p>Block time: {moment.unix(props.data.blocktime).format('ddd MM/YY HH:mm')}</p>
            <p>Confirmations: {props.data.confirmations}</p>
            <p>Total output: {totalOutput}</p>
            <Table columns = {columns} data = {dataArray} />
        </div>
    )
}

Tx.getInitialProps = async function(slug) {
    const info = await fetch('https://api.diviscan.io/tx/' + slug.query.transaction)
    const data = await info.json()

    return {
        data: data
    }
}

export default Tx

