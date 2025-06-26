import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantCard } from "./RestaurantCard"
import { WorkingHoursEditor } from "./WorkingHoursEditor"
import { APISettings, type APIConfig } from "./APISettings"
import { type RestaurantData, defaultRestaurantData } from "@/types/restaurant"
import { Download, Upload, Save, RotateCcw, Cloud, HardDrive } from "lucide-react"

const STORAGE_KEY = 'restaurant-admin-data'

export function AdminPanel() {
  const [data, setData] = useState<RestaurantData>(defaultRestaurantData)
  const [apiConfig, setApiConfig] = useState<APIConfig>({
    baseUrl: '',
    apiKey: '',
    enabled: false
  })
  const [isSyncing, setIsSyncing] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setData(parsedData)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      }
    }

    // Load API config
    const savedConfig = localStorage.getItem('api-config')
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)
        setApiConfig(parsedConfig)
      } catch (error) {
        console.error('Ошибка загрузки настроек API:', error)
      }
    }
  }, [])

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    alert('Данные сохранены локально!')
  }

  // Sync data to server via API
  const syncToServer = async () => {
    if (!apiConfig.baseUrl || !apiConfig.apiKey) {
      alert('Сначала настройте API подключение!')
      return
    }

    setIsSyncing(true)
    try {
      const baseUrl = apiConfig.baseUrl.replace(/\/$/, ''); // убираем слеш в конце
      const response = await fetch(`${baseUrl}/api/restaurant/working-hours`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        alert('Данные успешно синхронизированы с сервером!')
        // Также сохраняем локально
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } else {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      alert('Ошибка синхронизации: ' + error)
    } finally {
      setIsSyncing(false)
    }
  }

  // Load data from server via API
  const loadFromServer = async () => {
    if (!apiConfig.baseUrl || !apiConfig.apiKey) {
      alert('Сначала настройте API подключение!')
      return
    }

    setIsSyncing(true)
    try {
      const baseUrl = apiConfig.baseUrl.replace(/\/$/, ''); // убираем слеш в конце
      const response = await fetch(`${baseUrl}/api/restaurant/working-hours`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const serverData = await response.json()
        if (serverData && Object.keys(serverData).length > 0) {
          setData(serverData)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData))
          alert('Данные загружены с сервера!')
        } else {
          alert('На сервере нет данных')
        }
      } else {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      alert('Ошибка загрузки: ' + error)
    } finally {
      setIsSyncing(false)
    }
  }

  // Export data as JSON
  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'restaurant-working-hours.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Import data from JSON file
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string
          const importedData = JSON.parse(result)
          setData(importedData)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(importedData))
          alert('Данные успешно импортированы!')
        } catch (error) {
          alert('Ошибка импорта данных. Проверьте формат файла.')
        }
      }
      reader.readAsText(file)
    }
  }

  // Reset to default
  const resetData = () => {
    if (confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
      setData(defaultRestaurantData)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Generate HTML code for the card
  const generateHTMLCode = () => {
    const htmlCode = `<!-- Restaurant Working Hours Card -->
<div class="restaurant-info-card" style="height: 100%; width: 100%; border-radius: 20px; opacity: 1; position: relative; overflow: hidden; background: linear-gradient(135deg, rgb(45, 45, 45) 0%, rgb(55, 55, 55) 50%, rgb(40, 40, 40) 100%); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);">
  <div class="card-content" style="position: relative; height: 100%; padding: 32px; display: flex; flex-direction: column; justify-content: space-between;">
    <!-- Logo Section -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="images/image_001.webp" alt="Qitchen Restaurant Logo" style="height: 32px; width: auto; filter: brightness(1.2);" />
    </div>

    <!-- Working Hours -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-family: 'Forum', serif; font-size: 18px; font-weight: 400; color: rgb(239, 231, 210); margin-bottom: 16px; text-align: center; letter-spacing: 2px; text-transform: uppercase;">Working Hours</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${Object.entries(data.workingHours).map(([day, hours]) => {
          const dayName = day.charAt(0).toUpperCase() + day.slice(1)
          const statusColor = hours.status === 'green' ? 'rgb(34, 197, 94)' :
                             hours.status === 'yellow' ? 'rgb(234, 179, 8)' : 'rgb(239, 68, 68)'

          return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(239, 231, 210, 0.1);">
          <span style="font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.95);">${dayName}</span>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${hours.isOpen
              ? `<span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgb(239, 231, 210); font-weight: 600;">${hours.open} — ${hours.close}</span>`
              : `<span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(239, 231, 210, 0.6); font-weight: 600;">Закрыто</span>`
            }
            <span style="width: 6px; height: 6px; background-color: ${statusColor}; border-radius: 50%; opacity: 0.8;"></span>
          </div>
        </div>`
        }).join('\n        ')}
      </div>
    </div>

    <!-- Social Media -->
    <div style="margin-top: auto;">
      <h3 style="font-family: 'Forum', serif; font-size: 16px; font-weight: 400; color: rgb(239, 231, 210); margin-bottom: 16px; text-align: center; letter-spacing: 2px; text-transform: uppercase;">Follow Us</h3>
      <div style="display: flex; justify-content: center; gap: 12px;">
        <!-- Social media icons would go here -->
      </div>
    </div>
  </div>
</div>`

    // Copy to clipboard and download
    navigator.clipboard.writeText(htmlCode).then(() => {
      alert('HTML код скопирован в буфер обмена!')
    })

    const blob = new Blob([htmlCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'restaurant-card.html'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Админ панель ресторана
          </h1>
          <p className="text-gray-600">
            Управление рабочими часами и настройками карточки ресторана
          </p>
        </div>

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Редактор</TabsTrigger>
            <TabsTrigger value="api">API настройки</TabsTrigger>
            <TabsTrigger value="actions">Действия</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Editor Panel */}
              <div className="space-y-6">
                <WorkingHoursEditor data={data} onUpdate={setData} />
              </div>

              {/* Preview Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Предварительный просмотр</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <RestaurantCard data={data} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <APISettings onSave={setApiConfig} />
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            {/* Sync Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  Синхронизация с сервером
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={syncToServer}
                    disabled={!apiConfig.baseUrl || !apiConfig.apiKey || isSyncing}
                    className="flex items-center gap-2"
                  >
                    <Cloud className="w-4 h-4" />
                    {isSyncing ? 'Синхронизация...' : 'Отправить на сервер'}
                  </Button>
                  <Button
                    onClick={loadFromServer}
                    disabled={!apiConfig.baseUrl || !apiConfig.apiKey || isSyncing}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {isSyncing ? 'Загрузка...' : 'Загрузить с сервера'}
                  </Button>
                </div>
                {(!apiConfig.baseUrl || !apiConfig.apiKey) && (
                  <p className="text-sm text-gray-500 mt-2">
                    Настройте API подключение на вкладке "API настройки"
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Local Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  Локальные операции
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={saveData} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Сохранить локально
                  </Button>
                  <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Экспорт JSON
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Импорт JSON
                    </Button>
                  </div>
                  <Button onClick={generateHTMLCode} variant="secondary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Получить HTML код
                  </Button>
                  <Button onClick={resetData} variant="destructive" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Сбросить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
