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

const Block = props => {

    const router = useRouter()
    const slug = router.query.block
    const dataArray = []
    const columns = React.useMemo(
        () =>
        [
            {
                Header: 'Transactions in block',
                columns: [
                    {
                        Header: 'Hash',
                        accessor: 'hash'
                    },
                    // {
                    //     Header: 'Value out',
                    //     accessor: 'value'
                    // }
                ]
            }
        ],
        []
    )
    props.data.tx.map(txs => {
        // const txData = fetch('https://api.diviscan.io/tx/' + txs)
        // const txInfo = txData.json()
        const data = {
            hash: <a href={`/tx?transaction=${txs}`}>{txs}</a>
        }
        dataArray.push(data)
    })
    return(
        <div>
            <Header />
            <Search />
            <h1>Details for block: {props.data.height}</h1>
            <p>Hash: {props.data.hash}</p>
            <p>Confirmations: {props.data.confirmations}</p>
            <p>Size: {props.data.size}</p>
            <p>Time: {moment.unix(props.data.time).format('ddd MM/YY HH:mm')}</p>
            <p>Difficulty: {props.data.difficulty}</p>
            <p>Previous block: <a href={'/block?block=' + props.data.previousblockhash}>{props.data.previousblockhash}</a></p>
            <Table columns = {columns} data = {dataArray} />
        </div>
    )
}

Block.getInitialProps = async function(slug) {
    if (slug.query.block) {
        const info = await fetch('https://api.diviscan.io/block/' + slug.query.block)
        const data = await info.json()
        return {
            data: data.result
        }
    } else if (slug.query.blockheight) {
        const info = await fetch('https://api.diviscan.io/blockheight/' + slug.query.blockheight)
        const data = await info.json()
        return {
            data: data
        }
    }
    
}

export default Block