import "regenerator-runtime"
import { useState } from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce, useBlockLayout } from 'react-table'

function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}) {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      <input
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </span>
  )
}

export default function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useBlockLayout
  )

  const [hoverId, setHoverId] = useState("")

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        <tr>
          <th
            colSpan={columns.length}
            className="table-header"
          >
            Table Title
            <GlobalFilter
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </th>
        </tr>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr 
              {...row.getRowProps()} 
              onMouseEnter={() => setHoverId(row.id)} 
              onMouseLeave={() => setHoverId("")}
              className={row.id === hoverId? 'is-hover' : ''} 
            >
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