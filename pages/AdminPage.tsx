
import React from 'react';
import { useMedicines } from '../hooks/useMedicines';
import { RefreshCw, Trash2, FileJson, Check, ArrowRight, HelpCircle } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { medicines, loading, error, lastUpdated, reload, headerMapping } = useMedicines();

  const handleReload = () => {
    if (window.confirm("This will clear the local cache and fetch fresh data from the Google Sheet. Continue?")) {
      reload();
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin & Data Debug</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Data Source Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><strong>Status:</strong> {loading ? 'Loading...' : error ? <span className="text-red-600">Error</span> : <span className="text-green-600">Loaded</span>}</div>
            <div><strong>Medicines Count:</strong> {medicines.length}</div>
            <div><strong>Last Updated:</strong> {lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}</div>
        </div>
        {error && <p className="mt-4 text-red-600 bg-red-50 p-3 rounded-md"><strong>Error Details:</strong> {error}</p>}
        <div className="mt-6 flex space-x-4">
            <button onClick={handleReload} disabled={loading} className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-slate-400">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Reloading...' : 'Force Reload & Clear Cache'}
            </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Sheet Header to Model Mapping</h2>
        <p className="text-sm text-slate-600 mb-4">This shows how columns from your Google Sheet (left) are mapped to the application's data fields (right). If a field is missing, check your sheet's column names.</p>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Model Field</th>
                        <th scope="col" className="px-6 py-3">Mapped Sheet Header</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(headerMapping.entries()).map(([field, header]) => (
                         <tr key={field} className="bg-white border-b">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {field}
                            </th>
                            <td className="px-6 py-4">
                                {header || <span className="text-slate-400 italic">Not Found</span>}
                            </td>
                            <td className="px-6 py-4">
                                {header ? <Check className="w-5 h-5 text-green-500" /> : <HelpCircle className="w-5 h-5 text-yellow-500" />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Raw Data Viewer</h2>
        <p className="text-sm text-slate-600 mb-4">A preview of the first 5 records as they appear after being parsed from the sheet, before being mapped to the final model.</p>
        <div className="bg-slate-800 text-white p-4 rounded-md overflow-x-auto">
            <pre><code>{JSON.stringify(medicines.slice(0, 5).map(m => m.raw), null, 2)}</code></pre>
        </div>
      </div>

    </div>
  );
};

export default AdminPage;
