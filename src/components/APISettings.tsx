import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, TestTube, Zap, AlertCircle, CheckCircle } from "lucide-react"

interface APISettingsProps {
  onSave: (settings: APIConfig) => void
}

export interface APIConfig {
  baseUrl: string
  apiKey: string
  enabled: boolean
}

export function APISettings({ onSave }: APISettingsProps) {
  const [config, setConfig] = useState<APIConfig>({
    baseUrl: '',
    apiKey: '',
    enabled: false
  })
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    // Загружаем сохраненные настройки API
    const saved = localStorage.getItem('api-config')
    if (saved) {
      try {
        const parsedConfig = JSON.parse(saved)
        setConfig(parsedConfig)
      } catch (error) {
        console.error('Ошибка загрузки настроек API:', error)
      }
    }
  }, [])

  const saveConfig = () => {
    localStorage.setItem('api-config', JSON.stringify(config))
    onSave(config)
    alert('Настройки API сохранены!')
  }

  const testConnection = async () => {
    setIsTesting(true)
    try {
      const baseUrl = config.baseUrl.replace(/\/$/, ''); // убираем слеш в конце
      const response = await fetch(`${baseUrl}/api/test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setIsConnected(true)
        alert('Соединение успешно!')
      } else {
        setIsConnected(false)
        alert('Ошибка соединения: ' + response.statusText)
      }
    } catch (error) {
      setIsConnected(false)
      alert('Ошибка соединения: ' + error)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Настройки API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseUrl">URL основного сайта</Label>
            <Input
              id="baseUrl"
              type="url"
              placeholder="https://your-website.com"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API ключ</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="your-api-key"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={testConnection}
              disabled={!config.baseUrl || !config.apiKey || isTesting}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              {isTesting ? 'Тестирование...' : 'Тест соединения'}
            </Button>

            {isConnected !== null && (
              <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
                {isConnected ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Подключено
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    Ошибка
                  </>
                )}
              </Badge>
            )}
          </div>

          <Button onClick={saveConfig} className="w-full">
            Сохранить настройки
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Инструкция по настройке
          </h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>1. На основном сайте:</strong></p>
            <p>Добавьте API endpoint для получения данных карточки:</p>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              GET /api/restaurant/working-hours
            </code>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              POST /api/restaurant/working-hours
            </code>

            <p><strong>2. Пример PHP endpoint:</strong></p>
            <code className="block bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
{`<?php
// api/restaurant/working-hours.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = file_get_contents('working-hours.json');
    echo $data ?: '{}';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    file_put_contents('working-hours.json', $json);
    echo '{"success": true}';
}
?>`}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
