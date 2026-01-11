'use client'

import { TGuest } from '@/type'
import { TGuestStats, TRsvpProgress } from '@/lib/guest-manager'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import clsx from 'clsx'

interface Props {
  guests: TGuest[]
  rsvpProgress: TRsvpProgress
  stats: TGuestStats
}

const COLORS = {
  attending: '#10b981',
  pending: '#3b82f6',
  declined: '#ef4444',
  noResponse: '#f59e0b',
  bride: '#f43f5e',
  groom: '#3b82f6',
  mutual: '#a855f7',
  tier1: '#6366f1',
  tier2: '#8b5cf6',
}

export default function GuestAnalytics({ guests, rsvpProgress, stats }: Props) {
  // RSVP Status Data for Pie Chart
  const rsvpData = [
    { name: 'Attending', value: rsvpProgress.attending, color: COLORS.attending },
    { name: 'Pending', value: rsvpProgress.pending, color: COLORS.pending },
    { name: 'Declined', value: rsvpProgress.declined, color: COLORS.declined },
    { name: 'No Response', value: rsvpProgress.noResponse, color: COLORS.noResponse },
  ].filter((item) => item.value > 0)

  // Side Distribution Data
  const sideData = [
    { name: "Bride's Side", value: stats.bride.count, color: COLORS.bride },
    { name: "Groom's Side", value: stats.groom.count, color: COLORS.groom },
    { name: 'Mutual', value: stats.mutual.count, color: COLORS.mutual },
  ].filter((item) => item.value > 0)

  // Tier Distribution Data
  const tierData = [
    { name: 'Tier 1', value: stats.byTier.tier1, color: COLORS.tier1 },
    { name: 'Tier 2', value: stats.byTier.tier2, color: COLORS.tier2 },
  ].filter((item) => item.value > 0)

  // Overall Progress
  const overallProgress =
    rsvpProgress.total > 0
      ? ((rsvpProgress.attending + rsvpProgress.declined) / rsvpProgress.total) * 100
      : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-primary/10 bg-surface p-4">
          <div className="text-sm font-medium text-text/60">Total Guests</div>
          <div className="mt-1 text-3xl font-bold text-text">{stats.total}</div>
          <div className="mt-1 text-xs text-text/50">
            {stats.totalWithPlusOnes - stats.total > 0 
              ? `Including ${stats.totalWithPlusOnes - stats.total} additional people (families/groups)`
              : 'All single guests'}
          </div>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <div className="text-sm font-medium text-text/60">Attending</div>
          <div className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
            {rsvpProgress.attending}
          </div>
          <div className="mt-1 text-xs text-text/50">
            {rsvpProgress.attendingPercent.toFixed(1)}% of total
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="text-sm font-medium text-text/60">Pending</div>
          <div className="mt-1 text-3xl font-bold text-amber-600 dark:text-amber-400">
            {rsvpProgress.pending}
          </div>
          <div className="mt-1 text-xs text-text/50">
            {rsvpProgress.pendingPercent.toFixed(1)}% of total
          </div>
        </div>
        <div className="rounded-lg border border-primary/10 bg-surface p-4">
          <div className="text-sm font-medium text-text/60">Response Rate</div>
          <div className="mt-1 text-3xl font-bold text-text">{overallProgress.toFixed(0)}%</div>
          <div className="mt-1 text-xs text-text/50">Have responded</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP Status Pie Chart */}
        <div className="rounded-lg border border-primary/10 bg-surface p-6">
          <h3 className="text-lg font-semibold text-text mb-4">RSVP Status</h3>
          {rsvpData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rsvpData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {rsvpData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-text/40">
              No RSVP data yet
            </div>
          )}
        </div>

        {/* Side Distribution Pie Chart */}
        <div className="rounded-lg border border-primary/10 bg-surface p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Guest Distribution by Side</h3>
          {sideData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sideData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sideData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-text/40">
              No guest distribution data yet
            </div>
          )}
        </div>

        {/* Tier Distribution Bar Chart */}
        <div className="rounded-lg border border-primary/10 bg-surface p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-text mb-4">Priority Tier Distribution</h3>
          {tierData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tierData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-text/40">
              No tier distribution data yet
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-lg border border-primary/10 bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">RSVP Response Progress</h3>
          <span className="text-sm text-text/60">
            {rsvpProgress.attending + rsvpProgress.declined} of {rsvpProgress.total} responded
          </span>
        </div>
        <div className="h-6 w-full overflow-hidden rounded-full bg-background shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
          <div>
            <div className="font-medium text-text">Attending</div>
            <div className="text-text/60">{rsvpProgress.attending}</div>
          </div>
          <div>
            <div className="font-medium text-text">Pending</div>
            <div className="text-text/60">{rsvpProgress.pending}</div>
          </div>
          <div>
            <div className="font-medium text-text">Declined</div>
            <div className="text-text/60">{rsvpProgress.declined}</div>
          </div>
          <div>
            <div className="font-medium text-text">No Response</div>
            <div className="text-text/60">{rsvpProgress.noResponse}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

