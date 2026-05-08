import type {
  Employee,
  Team,
  Pulse,
  Insight,
  Recognition,
  Announcement,
  Notification,
  KpiMetric,
  EngagementDataPoint,
  DepartmentEngagement,
  User,
  PulseAnswer,
  Message,
} from '@/lib/types'

import {
  MOCK_EMPLOYEES,
  MOCK_TEAMS,
  MOCK_PULSES,
  MOCK_INSIGHTS,
  MOCK_RECOGNITIONS,
  MOCK_ANNOUNCEMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_KPI_METRICS,
  MOCK_ENGAGEMENT_DATA,
  MOCK_DEPARTMENT_ENGAGEMENT,
  MOCK_MESSAGES,
} from '@/lib/mock-data'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Throws an ApiError with `rate` probability (default 5%). */
export function mayFail(rate = 0.05): void {
  if (Math.random() < rate) {
    throw new ApiError(500, 'Error interno del servidor. Por favor intenta de nuevo.')
  }
}

function randomDelay(min = 300, max = 1200): Promise<void> {
  return delay(Math.floor(Math.random() * (max - min + 1)) + min)
}

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------

export async function fetchEmployees(): Promise<Employee[]> {
  await randomDelay()
  mayFail()
  return [...MOCK_EMPLOYEES]
}

export async function fetchEmployee(id: string): Promise<Employee> {
  await randomDelay(300, 700)
  mayFail()
  const employee = MOCK_EMPLOYEES.find((e) => e.id === id)
  if (!employee) {
    throw new ApiError(404, `Empleado con id "${id}" no encontrado.`)
  }
  return { ...employee }
}

export async function createEmployee(data: Partial<Employee>): Promise<Employee> {
  await randomDelay(600, 1200)
  mayFail()
  const newEmployee: Employee = {
    id: `emp-${Date.now()}`,
    name: data.name ?? 'Nuevo Empleado',
    email: data.email ?? 'nuevo@climaai.mx',
    avatar: data.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    department: data.department ?? 'Sin asignar',
    role: data.role ?? 'Colaborador',
    team: data.team ?? 'Sin equipo',
    teamId: data.teamId ?? '',
    manager: data.manager ?? '',
    managerId: data.managerId ?? '',
    startDate: data.startDate ?? new Date().toISOString().split('T')[0],
    status: data.status ?? 'onboarding',
    engagementScore: data.engagementScore ?? 50,
    riskScore: data.riskScore ?? 50,
    riskLevel: data.riskLevel ?? 'medium',
    lastPulse: '',
    streakDays: 0,
    badges: [],
    location: data.location ?? 'Ciudad de México',
    phone: data.phone ?? '',
  }
  return newEmployee
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  await randomDelay(500, 900)
  mayFail()
  const existing = MOCK_EMPLOYEES.find((e) => e.id === id)
  if (!existing) {
    throw new ApiError(404, `Empleado con id "${id}" no encontrado.`)
  }
  return { ...existing, ...data }
}

export async function deleteEmployee(id: string): Promise<void> {
  await randomDelay(400, 800)
  mayFail()
  const exists = MOCK_EMPLOYEES.some((e) => e.id === id)
  if (!exists) {
    throw new ApiError(404, `Empleado con id "${id}" no encontrado.`)
  }
}

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

export async function fetchTeams(): Promise<Team[]> {
  await randomDelay()
  mayFail()
  return [...MOCK_TEAMS]
}

export async function fetchTeam(id: string): Promise<Team> {
  await randomDelay(300, 600)
  mayFail()
  const team = MOCK_TEAMS.find((t) => t.id === id)
  if (!team) {
    throw new ApiError(404, `Equipo con id "${id}" no encontrado.`)
  }
  return { ...team }
}

// ---------------------------------------------------------------------------
// Pulses
// ---------------------------------------------------------------------------

export async function fetchPulses(): Promise<Pulse[]> {
  await randomDelay()
  mayFail()
  return [...MOCK_PULSES]
}

export async function fetchPulse(id: string): Promise<Pulse> {
  await randomDelay(300, 600)
  mayFail()
  const pulse = MOCK_PULSES.find((p) => p.id === id)
  if (!pulse) {
    throw new ApiError(404, `Pulso con id "${id}" no encontrado.`)
  }
  return { ...pulse }
}

export async function createPulse(data: Partial<Pulse>): Promise<Pulse> {
  await randomDelay(700, 1200)
  mayFail()
  const newPulse: Pulse = {
    id: `pulse-${Date.now()}`,
    title: data.title ?? 'Nuevo Pulso',
    description: data.description ?? '',
    status: 'draft',
    type: data.type ?? 'mood',
    participationRate: 0,
    createdAt: new Date().toISOString(),
    questions: data.questions ?? [],
    responses: 0,
    totalEmployees: MOCK_EMPLOYEES.length,
    ...data,
  }
  return newPulse
}

export async function activatePulse(id: string): Promise<Pulse> {
  await randomDelay(500, 900)
  mayFail()
  const pulse = MOCK_PULSES.find((p) => p.id === id)
  if (!pulse) {
    throw new ApiError(404, `Pulso con id "${id}" no encontrado.`)
  }
  return { ...pulse, status: 'active' }
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

export async function fetchInsights(): Promise<Insight[]> {
  await randomDelay()
  mayFail()
  return [...MOCK_INSIGHTS]
}

export async function fetchInsight(id: string): Promise<Insight> {
  await randomDelay(300, 600)
  mayFail()
  const insight = MOCK_INSIGHTS.find((i) => i.id === id)
  if (!insight) {
    throw new ApiError(404, `Insight con id "${id}" no encontrado.`)
  }
  return { ...insight }
}

export async function markInsightRead(id: string): Promise<void> {
  await randomDelay(300, 500)
  mayFail()
  const exists = MOCK_INSIGHTS.some((i) => i.id === id)
  if (!exists) {
    throw new ApiError(404, `Insight con id "${id}" no encontrado.`)
  }
}

// ---------------------------------------------------------------------------
// Recognitions
// ---------------------------------------------------------------------------

export async function fetchRecognitions(): Promise<Recognition[]> {
  await randomDelay()
  mayFail()
  return [...MOCK_RECOGNITIONS]
}

export async function createRecognition(data: Partial<Recognition>): Promise<Recognition> {
  await randomDelay(600, 1000)
  mayFail()
  const newRecognition: Recognition = {
    id: `rec-${Date.now()}`,
    fromId: data.fromId ?? '',
    fromName: data.fromName ?? '',
    fromAvatar: data.fromAvatar ?? '',
    toId: data.toId ?? '',
    toName: data.toName ?? '',
    toAvatar: data.toAvatar ?? '',
    message: data.message ?? '',
    badge: data.badge ?? 'Reconocimiento',
    badgeColor: data.badgeColor ?? '#0c365c',
    badgeIcon: data.badgeIcon ?? '⭐',
    createdAt: new Date().toISOString(),
    reactions: [],
    department: data.department ?? '',
    isPublic: data.isPublic ?? true,
  }
  return newRecognition
}

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------

export async function fetchAnnouncements(): Promise<Announcement[]> {
  await randomDelay()
  mayFail()
  return [...MOCK_ANNOUNCEMENTS]
}

export async function createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
  await randomDelay(700, 1100)
  mayFail()
  const newAnnouncement: Announcement = {
    id: `ann-${Date.now()}`,
    title: data.title ?? 'Nuevo Anuncio',
    content: data.content ?? '',
    authorId: data.authorId ?? '',
    authorName: data.authorName ?? '',
    authorAvatar: data.authorAvatar ?? '',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    status: data.status ?? 'draft',
    targetAudience: data.targetAudience ?? 'all',
    readCount: 0,
    totalEmployees: MOCK_EMPLOYEES.length,
    pinned: data.pinned ?? false,
    category: data.category ?? 'general',
  }
  return newAnnouncement
}

// ---------------------------------------------------------------------------
// Dashboard KPIs
// ---------------------------------------------------------------------------

export async function fetchDashboardKpis(): Promise<KpiMetric[]> {
  await randomDelay(400, 800)
  mayFail()
  return [...MOCK_KPI_METRICS]
}

export async function fetchEngagementData(): Promise<EngagementDataPoint[]> {
  await randomDelay(500, 900)
  mayFail()
  return [...MOCK_ENGAGEMENT_DATA]
}

export async function fetchDepartmentEngagement(): Promise<DepartmentEngagement[]> {
  await randomDelay(400, 700)
  mayFail()
  return [...MOCK_DEPARTMENT_ENGAGEMENT]
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function fetchMessages(): Promise<Message[]> {
  await randomDelay()
  mayFail()
  return [...MOCK_MESSAGES]
}

// ---------------------------------------------------------------------------
// Auth (simulated)
// ---------------------------------------------------------------------------

const ADMIN_USER: User = {
  id: 'emp-008',
  name: 'Patricia Flores Ríos',
  email: 'admin@climaai.mx',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia',
  role: 'admin',
  department: 'Recursos Humanos',
  permissions: ['employees:read', 'employees:write', 'pulses:read', 'pulses:write', 'insights:read', 'announcements:write', 'reports:read'],
}

const EMPLOYEE_USER: User = {
  id: 'emp-001',
  name: 'Carlos García Morales',
  email: 'carlos.garcia@climaai.mx',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  role: 'employee',
  department: 'Ingeniería',
  permissions: ['pulses:respond', 'recognitions:read', 'recognitions:write', 'announcements:read'],
}

export async function loginAdmin(email: string, _password: string): Promise<User> {
  await randomDelay(800, 1200)
  if (!email) {
    throw new ApiError(400, 'El correo es requerido.')
  }
  return { ...ADMIN_USER, email }
}

export async function loginEmployee(email: string, _password: string): Promise<User> {
  await randomDelay(800, 1200)
  if (!email) {
    throw new ApiError(400, 'El correo es requerido.')
  }
  const employee = MOCK_EMPLOYEES.find((e) => e.email === email)
  if (employee) {
    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      avatar: employee.avatar,
      role: 'employee',
      department: employee.department,
      permissions: ['pulses:respond', 'recognitions:read', 'recognitions:write', 'announcements:read'],
    }
  }
  return { ...EMPLOYEE_USER, email }
}

export async function logout(): Promise<void> {
  await randomDelay(300, 600)
}

// ---------------------------------------------------------------------------
// Employee-specific
// ---------------------------------------------------------------------------

export async function fetchMyPulse(): Promise<Pulse | null> {
  await randomDelay(400, 700)
  mayFail()
  const activePulse = MOCK_PULSES.find((p) => p.status === 'active')
  return activePulse ? { ...activePulse } : null
}

export async function submitPulseResponse(pulseId: string, answers: PulseAnswer[]): Promise<void> {
  await randomDelay(700, 1200)
  mayFail()
  const pulse = MOCK_PULSES.find((p) => p.id === pulseId)
  if (!pulse) {
    throw new ApiError(404, `Pulso con id "${pulseId}" no encontrado.`)
  }
  if (!answers || answers.length === 0) {
    throw new ApiError(400, 'Debes responder al menos una pregunta.')
  }
}

export async function fetchMyNotifications(): Promise<Notification[]> {
  await randomDelay(300, 600)
  mayFail()
  return [...MOCK_NOTIFICATIONS]
}
