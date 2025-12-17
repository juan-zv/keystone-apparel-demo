// Demo version using localStorage for data persistence

interface LocalStorageTable {
  data: any[]
  nextId: number
}

class LocalStorageDB {
  private getTable(tableName: string): LocalStorageTable {
    const data = localStorage.getItem(tableName)
    if (!data) {
      return { data: [], nextId: 1 }
    }
    return JSON.parse(data)
  }

  private saveTable(tableName: string, table: LocalStorageTable): void {
    localStorage.setItem(tableName, JSON.stringify(table))
  }

  from(tableName: string) {
    const self = this
    return {
      select: (columns: string = '*') => {
        const table = self.getTable(tableName)
        
        return {
          data: table.data,
          error: null,
          
          gte: (column: string, value: any) => {
            const filtered = table.data.filter(row => new Date(row[column]) >= new Date(value))
            return {
              lt: (column2: string, value2: any) => {
                const result = filtered.filter(row => new Date(row[column2]) < new Date(value2))
                return { data: result, error: null }
              },
              data: filtered,
              error: null
            }
          },
          
          order: (column: string, options?: { ascending?: boolean }) => {
            const sorted = [...table.data].sort((a, b) => {
              const aVal = a[column]
              const bVal = b[column]
              if (options?.ascending === false) {
                return bVal > aVal ? 1 : -1
              }
              return aVal > bVal ? 1 : -1
            })
            return { data: sorted, error: null }
          }
        }
      },
      
      insert: (records: any | any[]) => {
        const table = self.getTable(tableName)
        const recordsArray = Array.isArray(records) ? records : [records]
        
        const newRecords = recordsArray.map(record => ({
          ...record,
          id: record.id || `${table.nextId++}`
        }))
        
        table.data.push(...newRecords)
        self.saveTable(tableName, table)
        
        const result = { data: newRecords, error: null }
        
        // Return a promise with select method as a property (not on prototype)
        const promise = new Promise((resolve) => resolve(result))
        Object.defineProperty(promise, 'select', {
          value: () => Promise.resolve(result),
          enumerable: false
        })
        
        return promise as any
      },
      
      update: (updates: any) => {
        return {
          eq: async (column: string, value: any) => {
            const table = self.getTable(tableName)
            table.data = table.data.map(row => 
              row[column] === value ? { ...row, ...updates } : row
            )
            self.saveTable(tableName, table)
            return { data: null, error: null }
          },
          in: async (column: string, values: any[]) => {
            const table = self.getTable(tableName)
            table.data = table.data.map(row => 
              values.includes(row[column]) ? { ...row, ...updates } : row
            )
            self.saveTable(tableName, table)
            return { data: null, error: null }
          }
        }
      },
      
      delete: () => {
        return {
          in: async (column: string, values: any[]) => {
            const table = self.getTable(tableName)
            table.data = table.data.filter(row => !values.includes(row[column]))
            self.saveTable(tableName, table)
            return { data: null, error: null }
          }
        }
      }
    }
  }
}

const db = new LocalStorageDB()

export default db
