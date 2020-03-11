import Header from '../components/Header'
import Search from '../components/Search'
import Link from 'next/link' 
import fetch from 'isomorphic-unfetch'
import { useTable, usePagination, useSortBy } from 'react-table'

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
        useSortBy,
        usePagination,
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

function Masternodes(props) {
    const columns = React.useMemo(
        () => 
        [
            {
                Header: 'Masternodes',
                columns: [
                    {
                        Header: 'Address',
                        accessor: 'address',
                        sortType: 'basic'
                    },
                    {
                        Header: 'Amount Received',
                        accessor: 'amountReceived',
                        sortType: 'basic'
                    },
                    {
                        Header: 'Balance',
                        accessor: 'balance',
                        sortType: 'basic'
                    },
                    {
                        Header: 'Tier',
                        accessor: 'tier',
                        sortType: 'basic'
                    }
                ]
            }
        ],
        []
    )
    const dataArray = []
    props.info.uniqRewards.map(mn => {
        const data = {
            address: mn.address,
            amountReceived: mn.amountReceived,
            balance: mn.balance,
            tier: mn.layer
        }
        dataArray.push(data)
    })

    return(
        <div>
            <Header />
            <Search />
            <Table columns = {columns} data = {dataArray} />
        </div>
    )
}

Masternodes.getInitialProps = async function() {
    const res = await fetch('https://api.diviscan.io/masternodes')
    const data = await res.json()
    return {
        info: data
    }
}
 
export default Masternodes