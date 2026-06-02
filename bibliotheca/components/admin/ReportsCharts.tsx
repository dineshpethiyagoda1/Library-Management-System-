'use client'
// components/admin/ReportsCharts.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const weeklyData = [
  { week:'Week 1',issues:42},{week:'Week 2',issues:58},{week:'Week 3',issues:51},
  {week:'Week 4',issues:67},{week:'Week 5',issues:74},
]
const memberDist = [
  { name:'Students',count:700},{name:'Faculty',count:340},{name:'Public',count:194},
]
const revenueData = [
  {month:'Jan',revenue:320},{month:'Feb',revenue:480},{month:'Mar',revenue:550},
  {month:'Apr',revenue:620},{month:'May',revenue:710},
]

interface Props { booksByCategory: {name:string;books:number}[]; topBooks:{title:string;count:number}[] }

export default function ReportsCharts({ booksByCategory, topBooks }: Props) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Issue & Return Trends */}
      <div className="card">
        <h3 className="font-semibold text-blue-700 mb-4">Issue & Return Trends</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{fontSize:10,fill:'#6b7280'}} />
            <YAxis tick={{fontSize:10,fill:'#6b7280'}} />
            <Tooltip />
            <Bar dataKey="issues" fill="#1e3a5f" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Books by Category */}
      <div className="card">
        <h3 className="font-semibold text-blue-700 mb-4">Books by Category</h3>
        <div className="space-y-2">
          {booksByCategory.slice(0,6).map(b => (
            <div key={b.name} className="flex items-center justify-between text-sm">
              <span className="text-gray-600 w-24 truncate text-xs">{b.name}</span>
              <span className="text-gray-900 font-medium text-xs">{b.books} books</span>
            </div>
          ))}
        </div>
      </div>

      {/* Member Distribution */}
      <div className="card">
        <h3 className="font-semibold text-blue-700 mb-4">Member Distribution</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={memberDist} barSize={32}>
            <XAxis dataKey="name" tick={{fontSize:10,fill:'#6b7280'}} />
            <YAxis tick={{fontSize:10,fill:'#6b7280'}} />
            <Tooltip />
            <Bar dataKey="count" fill="#1e3a5f" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most Issued Books */}
      <div className="card">
        <h3 className="font-semibold text-blue-700 mb-4">Most Issued Books</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={topBooks.map(b=>({name:b.title.slice(0,10),count:b.count}))} barSize={24}>
            <XAxis dataKey="name" tick={{fontSize:9,fill:'#6b7280'}} />
            <YAxis tick={{fontSize:10,fill:'#6b7280'}} />
            <Tooltip />
            <Bar dataKey="count" fill="#1e3a5f" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Overview */}
      <div className="card">
        <h3 className="font-semibold text-blue-700 mb-4">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revenueData} barSize={24}>
            <XAxis dataKey="month" tick={{fontSize:10,fill:'#6b7280'}} />
            <YAxis tick={{fontSize:10,fill:'#6b7280'}} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#1e3a5f" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overdue Report */}
      <div className="card">
        <h3 className="font-semibold text-blue-700 mb-4">Overdue Report</h3>
        <div className="h-44 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          No overdue data to display
        </div>
      </div>
    </div>
  )
}
