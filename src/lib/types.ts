// Employee types
export interface Employee {
  id: string
  name: string
  email: string
  avatar: string
  department: string
  role: string
  team: string
  teamId: string
  manager: string
  managerId: string
  startDate: string
  status: 'active' | 'inactive' | 'onboarding'
  engagementScore: number
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  lastPulse: string
  streakDays: number
  badges: Badge[]
  location: string
  phone: string
}

// Team types
export interface Team {
  id: string
  name: string
  department: string
  managerId: string
  managerName: string
  memberCount: number
  engagementScore: number
  riskScore: number
  color: string
}

// Pulse/Survey types
export interface Pulse {
  id: string
  title: string
  description: string
  status: 'draft' | 'active' | 'completed' | 'scheduled'
  type: 'mood' | 'engagement' | 'enps' | 'custom'
  participationRate: number
  createdAt: string
  scheduledAt?: string
  completedAt?: string
  questions: PulseQuestion[]
  responses: number
  totalEmployees: number
}

export interface PulseQuestion {
  id: string
  text: string
  type: 'emoji' | 'scale' | 'text' | 'multiple'
  options?: string[]
}

export interface PulseResponse {
  id: string
  pulseId: string
  employeeId: string
  submittedAt: string
  answers: PulseAnswer[]
  mood?: number
  anonymous: boolean
}

export interface PulseAnswer {
  questionId: string
  value: string | number
}

// Insight types
export interface Insight {
  id: string
  type: 'burnout' | 'morale' | 'engagement' | 'retention' | 'recognition'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  affectedEmployees: number
  affectedTeams: string[]
  recommendation: string
  confidence: number
  createdAt: string
  isRead: boolean
}

// Recognition types
export interface Recognition {
  id: string
  fromId: string
  fromName: string
  fromAvatar: string
  toId: string
  toName: string
  toAvatar: string
  message: string
  badge: string
  badgeColor: string
  badgeIcon: string
  createdAt: string
  reactions: Reaction[]
  department: string
  isPublic: boolean
}

export interface Reaction {
  emoji: string
  count: number
  userReacted: boolean
}

// Badge types
export interface Badge {
  id: string
  name: string
  icon: string
  color: string
  description: string
  earnedAt: string
}

// KPI types
export interface KpiMetric {
  id: string
  label: string
  value: number
  previousValue: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  color: string
}

// Analytics types
export interface EngagementDataPoint {
  date: string
  score: number
  participation: number
  enps: number
}

export interface DepartmentEngagement {
  department: string
  score: number
  employees: number
  risk: number
}

// Announcement types
export interface Announcement {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorAvatar: string
  createdAt: string
  publishedAt: string
  status: 'draft' | 'published' | 'scheduled'
  targetAudience: 'all' | 'team' | 'department'
  readCount: number
  totalEmployees: number
  pinned: boolean
  category: 'general' | 'policy' | 'event' | 'achievement' | 'update'
}

// Message types
export interface Message {
  id: string
  fromId: string
  fromName: string
  fromAvatar: string
  content: string
  createdAt: string
  isRead: boolean
  type: 'direct' | 'alert' | 'system'
}

// User/Auth types
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'manager' | 'employee'
  department: string
  permissions: string[]
}

// Notification types
export interface Notification {
  id: string
  type: 'recognition' | 'pulse' | 'announcement' | 'achievement' | 'alert'
  title: string
  message: string
  createdAt: string
  isRead: boolean
  actionUrl?: string
  icon: string
  fromName?: string
  fromAvatar?: string
}
