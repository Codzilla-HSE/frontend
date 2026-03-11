FrontEnd написан на React с использованием сборщика Vite

Для тестов используются Vitest и React Testing Library (RTL)

## Требования для запуска
Чтобы всё работало точно так же, как у меня, убедись, что у тебя установлена правильная версия Node.js

Инструкция по установке node.js и npm https://nodejs.org/en/download
* **Node.js**: v24.14.0
* **npm**: v11.9.0

## Как развернуть проект локально

1. **Склонируй репозиторий:**
   ```bash
   git clone git@github.com:Codzilla-HSE/frontend.git
   cd frontend

2. **Установи зависимости:**
Зависимости подтянутся из файла package-lock.json автоматически
    ```bash
    npm ci

3. **Можешь запустить в режиме разработки (с hot reload):**
    ```bash
    npm run dev

4. **Сборка в прод:**
   ```bash
   npm run build

5. **Запуск тестов:**
   ```bash
   npm run test

6. **Проверка стиля:**
   ```bash
   npm run lint
