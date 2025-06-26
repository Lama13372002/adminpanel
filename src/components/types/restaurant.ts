export type StatusColor = 'green' | 'yellow' | 'red'

export interface WorkingHours {
  open: string
  close: string
  isOpen: boolean
  status: StatusColor
}

export interface RestaurantData {
  workingHours: {
    monday: WorkingHours
    tuesday: WorkingHours
    wednesday: WorkingHours
    thursday: WorkingHours
    friday: WorkingHours
    saturday: WorkingHours
    sunday: WorkingHours
  }
}

export const defaultRestaurantData: RestaurantData = {
  workingHours: {
    monday: { open: '11:00', close: '22:00', isOpen: true, status: 'green' },
    tuesday: { open: '11:00', close: '22:00', isOpen: true, status: 'green' },
    wednesday: { open: '11:00', close: '22:00', isOpen: true, status: 'green' },
    thursday: { open: '11:00', close: '22:00', isOpen: true, status: 'green' },
    friday: { open: '11:00', close: '23:00', isOpen: true, status: 'green' },
    saturday: { open: '11:00', close: '23:00', isOpen: true, status: 'green' },
    sunday: { open: '12:00', close: '21:00', isOpen: true, status: 'yellow' },
  }
}

export const statusColorMap: Record<StatusColor, string> = {
  green: 'rgb(34, 197, 94)',
  yellow: 'rgb(234, 179, 8)',
  red: 'rgb(239, 68, 68)'
}

export const statusLabels: Record<StatusColor, string> = {
  green: 'Открыто',
  yellow: 'Ограниченно',
  red: 'Закрыто'
}
