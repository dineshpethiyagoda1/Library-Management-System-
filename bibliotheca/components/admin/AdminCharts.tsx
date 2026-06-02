'use client'
// components/admin/AdminCharts.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const monthlyData = [
  { month: 'Jan', issues: 180 }, { month: 'Feb', issues: 220 },
  { month: 'Mar', issues: 195 }, { month: 'Apr', issues: 260 },
  { month: 'May', issues: 310 },
]

const categoryData = [
  { name: 'Fiction',  books: 450 }, { name: 'Science', books: 320 },
  { name: 'History',  books: 280 }, { name: 'Tech',    books: 385 },
  { name: 'Arts',     books: 215 },
]

export default function AdminCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4 text-blue-700">Monthly Trends</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip />
            <Bar dataKey="issues" fill="#1e3a5f" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4 text-blue-700">Books by Category</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip />
            <Bar dataKey="books" fill="#1e3a5f" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
