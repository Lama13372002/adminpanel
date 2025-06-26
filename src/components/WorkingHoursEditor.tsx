import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { type RestaurantData, type StatusColor, statusLabels, statusColorMap } from "@/types/restaurant"

interface WorkingHoursEditorProps {
  data: RestaurantData
  onUpdate: (data: RestaurantData) => void
}

const dayNames: Record<string, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье'
}

export function WorkingHoursEditor({ data, onUpdate }: WorkingHoursEditorProps) {
  const updateWorkingHours = (day: keyof typeof data.workingHours, field: keyof typeof data.workingHours.monday, value: string | boolean | StatusColor) => {
    const newData = {
      ...data,
      workingHours: {
        ...data.workingHours,
        [day]: {
          ...data.workingHours[day],
          [field]: value
        }
      }
    }
    onUpdate(newData)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Редактирование рабочих часов</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(data.workingHours).map(([day, hours]) => (
          <div key={day} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Label className="font-medium text-base min-w-[100px]">
                {dayNames[day]}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={hours.isOpen}
                onCheckedChange={(checked) => updateWorkingHours(day as keyof typeof data.workingHours, 'isOpen', checked)}
              />
              <Label className="text-sm text-gray-600">
                {hours.isOpen ? 'Открыто' : 'Закрыто'}
              </Label>
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Открытие</Label>
              <Input
                type="time"
                value={hours.open}
                onChange={(e) => updateWorkingHours(day as keyof typeof data.workingHours, 'open', e.target.value)}
                disabled={!hours.isOpen}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Закрытие</Label>
              <Input
                type="time"
                value={hours.close}
                onChange={(e) => updateWorkingHours(day as keyof typeof data.workingHours, 'close', e.target.value)}
                disabled={!hours.isOpen}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Статус</Label>
              <Select
                value={hours.status}
                onValueChange={(value: StatusColor) => updateWorkingHours(day as keyof typeof data.workingHours, 'status', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([color, label]) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: statusColorMap[color as StatusColor] }}
                        />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Цветовые индикаторы:</h4>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(statusLabels).map(([color, label]) => (
              <Badge key={color} variant="outline" className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusColorMap[color as StatusColor] }}
                />
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
