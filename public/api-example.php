<?php
/**
 * Пример API endpoint для работы с админ панелью ресторана
 * Разместите этот файл на вашем основном сайте по пути: /api/restaurant/working-hours.php
 */

// Настройки
$DATA_FILE = 'working-hours.json';
$API_KEY = 'your-secret-api-key-here'; // Замените на ваш API ключ

// CORS заголовки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Проверка авторизации
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !preg_match('/Bearer\s+(.*)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Отсутствует токен авторизации']);
    exit();
}

$token = $matches[1];
if ($token !== $API_KEY) {
    http_response_code(403);
    echo json_encode(['error' => 'Неверный API ключ']);
    exit();
}

// Обработка запросов
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Получение данных
        if (file_exists($DATA_FILE)) {
            $data = file_get_contents($DATA_FILE);
            echo $data;
        } else {
            echo json_encode([]);
        }
        break;

    case 'POST':
        // Сохранение данных
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'Неверный формат JSON']);
            exit();
        }

        // Валидация данных (опционально)
        if (!isset($data['workingHours'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Отсутствуют данные workingHours']);
            exit();
        }

        // Сохранение в файл
        if (file_put_contents($DATA_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            echo json_encode(['success' => true, 'message' => 'Данные сохранены']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка сохранения данных']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Метод не поддерживается']);
        break;
}

// Тестовый endpoint
if (strpos($_SERVER['REQUEST_URI'], '/api/test') !== false) {
    echo json_encode(['status' => 'ok', 'message' => 'API работает']);
}
?>
