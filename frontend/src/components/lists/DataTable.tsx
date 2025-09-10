import { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Edit, 
  Trash2, 
  Eye,
  Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../common/Button';
import { Input } from '../forms/Input';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { TableProps } from '../../types';

/**
 * Professional Data Table Component
 * Sorting, search, pagination, and action buttons
 */
export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No records found",
  onEdit,
  onDelete,
  onView,
  onSort,
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Filter data based on search term
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof T) => {
    if (!columns.find(col => col.key === key)?.sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    
    onSort?.(key);
  };

  const renderSortIcon = (key: keyof T) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return null;
    
    if (sortConfig.key !== key) {
      return <ChevronUp className="w-4 h-4 text-secondary-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-primary-600" />
      : <ChevronDown className="w-4 h-4 text-primary-600" />;
  };

  const renderActionButtons = (item: T) => {
    const hasActions = onView || onEdit || onDelete;
    if (!hasActions) return null;

    return (
      <div className="flex items-center space-x-2">
        {onView && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => onView(item)}
            className="!p-2"
            aria-label="View"
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
        
        {onEdit && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => onEdit(item)}
            className="!p-2"
            aria-label="Edit"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        
        {onDelete && (
          <Button
            variant="danger"
            size="small"
            onClick={() => onDelete(item)}
            className="!p-2"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <LoadingSpinner size="large" text="Loading data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header with Search */}
      <div className="card-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <h3 className="text-lg font-semibold text-secondary-900">
            Data Table
          </h3>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-w-[250px]"
              />
            </div>
            
            <span className="text-sm text-secondary-600">
              {filteredData.length} / {data.length} records
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-head">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={clsx(
                    'table-header',
                    {
                      'cursor-pointer hover:bg-secondary-100': column.sortable,
                    }
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.header}</span>
                    {renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              
              {/* Actions column */}
              {(onView || onEdit || onDelete) && (
                <th className="table-header w-32">Actions</th>
              )}
            </tr>
          </thead>
          
          <tbody className="table-body">
            {sortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (onView || onEdit || onDelete ? 1 : 0)}
                  className="table-cell text-center py-12"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Search className="w-12 h-12 text-secondary-300" />
                    <p className="text-secondary-600">{emptyMessage}</p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr 
                  key={index}
                  className="hover:bg-secondary-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="table-cell">
                      {column.render 
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '-')
                      }
                    </td>
                  ))}
                  
                  {/* Actions cell */}
                  {(onView || onEdit || onDelete) && (
                    <td className="table-cell">
                      {renderActionButtons(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}