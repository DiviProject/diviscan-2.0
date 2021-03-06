import { useTable } from 'react-table'
import moment from 'moment'

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns,
        data,
      })

    return (
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
                {rows.map((row, i) => {
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
    )
}

function LatestBlocks(props) {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Latest Blocks',
                columns: [
                    {
                        Header: 'Block Height',
                        accessor: 'blockHeight'
                    },
                    {
                        Header: 'Hash',
                        accessor: 'blockHash'
                    },
                    {
                        Header: 'Time',
                        accessor: 'time'
                    },
                    {
                        Header: 'No. of Transactions',
                        accessor: 'txs'
                    }
                ]
            }
        ],
        []
    )

    const dataArray = []
    props.blocks.map(block => {
        const data = {
            blockHeight: <a href={`/block?blockheight=${block.height}`}>{block.height}</a>,
            blockHash: <a href={`/block?block=${block.hash}`}>{block.hash}</a>,
            time: moment.unix(block.time).format('dddd MMMM YY HH:mm'),
            txs: block.tx.length
        }
        dataArray.push(data)
    })
    
    return(
        <div>
            <h1>Latest blocks</h1>
            <Table columns = {columns} data = {dataArray} />
        </div>
    )
}

export default LatestBlocks