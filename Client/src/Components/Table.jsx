import React from "react";

function Table({
  columns,
  data,
  page = 1,
  setPage,
  search = "",
  setSearch,
  enableSearch = false,
  totalPages,
}) {
  const handlePrev = () => {
    if (!setPage) return;
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (!setPage) return;
    if (totalPages && page >= totalPages) return;
    setPage(page + 1);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {enableSearch && setSearch && (
          <input
            type="text"
            value={search}
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-64"
          />
        )}

       
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                {col.label}
              </th>
            ))}
           
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                className="px-4 py-6 text-center text-gray-500"
              >
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row._id || index} className="transition hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-sm text-gray-600">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {setPage && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={handlePrev}
            disabled={page <= 1}
            className="rounded-full border border-gray-300 px-3 py-1 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm">{page}</span>
          <button
            onClick={handleNext}
            disabled={Boolean(totalPages) && page >= totalPages}
            className="rounded-full border border-gray-300 px-3 py-1 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Table;