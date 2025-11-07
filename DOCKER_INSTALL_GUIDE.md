# Docker Installation Guide для Windows

## Метод 1: Ръчно сваляне (Препоръчително)
1. Отидете на: https://www.docker.com/products/docker-desktop/
2. Кликнете "Download for Windows"
3. Стартирайте изтегления файл като Administrator
4. Следвайте инструкциите за инсталация
5. Рестартирайте компютъра след инсталацията
6. Стартирайте Docker Desktop от Start Menu
7. Изчакайте да се инициализира (може да отнеме няколко минути)

## Метод 2: PowerShell като Administrator
```powershell
# Отворете PowerShell като Administrator
# Инсталирайте Chocolatey ако го няма:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Инсталирайте Docker Desktop:
choco install docker-desktop -y
```

## Метод 3: Windows Package Manager (ако е наличен)
```powershell
# Отворете PowerShell като Administrator
winget install Docker.DockerDesktop
```

## Проверка на инсталацията
След инсталация и рестарт:
```powershell
docker --version
docker-compose --version
```

## Важни бележки:
- Docker Desktop изисква Windows 10/11 Pro, Enterprise, или Education
- За Windows Home трябва да е активиран WSL2
- След инсталация може да е нужно да влезете в BIOS и активирате Virtualization
- Първото стартиране може да отнеме време

## Ако има проблеми:
1. Проверете дали Hyper-V е активен (Windows Features)
2. Проверете дали WSL2 е инсталиран: `wsl --install`
3. Рестартирайте Windows след промени
4. Стартирайте Docker Desktop като Administrator

## След успешна инсталация:
Върнете се в този проект и стартирайте:
```powershell
cd C:\Users\Lebovo\Documents\ai-tools-fullstack
.\START_SYSTEM.bat
```