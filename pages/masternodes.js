import Header from '../components/Header'
import Link from 'next/link' 
import fetch from 'isomorphic-unfetch'
import { useTable } from 'react-table'

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

function Masternodes(props) {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Masternodes',
                columns: [
                    {
                        Header: 'Address',
                        accessor: 'address'
                    },
                    {
                        Header: 'Amount Received',
                        accessor: 'amountReceived'
                    },
                    {
                        Header: 'Balance',
                        accessor: 'balance'
                    },
                    {
                        Header: 'Tier',
                        accessor: 'tier'
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