# AI Tools - Environment Configuration Validator
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " AI Tools - Environment Validation" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan

param(
    [switch]$AutoFix,
    [switch]$AutoStart
)

# If the user didn't pass -AutoFix explicitly, enable AutoFix by default
if (-not $PSBoundParameters.ContainsKey('AutoFix')) {
    $AutoFix = $true
    Write-Host "[AutoFix] AutoFix enabled by default" -ForegroundColor Cyan
}

$errors = @()
$warnings = @()

Write-Host ""
Write-Host "Validating Frontend Configuration..." -ForegroundColor Green

# Check frontend .env.local
if (Test-Path "frontend\.env.local") {
    $frontendEnv = Get-Content "frontend\.env.local" -Raw
    Write-Host "[✓] Frontend .env.local exists" -ForegroundColor Green
    
    # Validate API URLs
    if ($frontendEnv -match "NEXT_PUBLIC_API_URL=http://localhost:8000") {
        Write-Host "[✓] API URL correctly configured" -ForegroundColor Green
    } else {
        $errors += "Frontend API URL not properly configured"
        Write-Host "[✗] API URL configuration error" -ForegroundColor Red
    }
    
    # Check 2FA enabled
    if ($frontendEnv -match "NEXT_PUBLIC_2FA_ENABLED=true") {
        Write-Host "[✓] 2FA enabled in frontend" -ForegroundColor Green
    } else {
        $warnings += "2FA not enabled in frontend"
        Write-Host "[!] 2FA not enabled" -ForegroundColor Yellow
    }
    
    # Check Supabase config
    if ($frontendEnv -match "NEXT_PUBLIC_SUPABASE_URL=https://") {
        Write-Host "[✓] Supabase URL configured" -ForegroundColor Green
    } else {
        $warnings += "Supabase URL not configured"
        Write-Host "[!] Supabase URL missing" -ForegroundColor Yellow
    }
} else {
    $errors += "Frontend .env.local file missing"
    Write-Host "[✗] Frontend .env.local missing" -ForegroundColor Red
    if ($AutoFix) {
        Write-Host "[AutoFix] Creating frontend/.env.local with defaults..." -ForegroundColor Cyan
        $defaultFrontendEnv = @()
        $defaultFrontendEnv += "NEXT_PUBLIC_API_URL=http://localhost:8000"
        $defaultFrontendEnv += "NEXT_PUBLIC_2FA_ENABLED=true"
        $defaultFrontendEnv += "NEXT_PUBLIC_SUPABASE_URL="
        New-Item -Path "frontend\.env.local" -ItemType File -Force | Out-Null
        $defaultFrontendEnv | Set-Content -Path "frontend\.env.local"
        Write-Host "[AutoFix] frontend/.env.local created" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Validating Backend Configuration..." -ForegroundColor Green

# Check backend .env
if (Test-Path "backend\.env") {
    $backendEnv = Get-Content "backend\.env" -Raw
    Write-Host "[✓] Backend .env exists" -ForegroundColor Green
    
    # Check APP_KEY
    if ($backendEnv -match "APP_KEY=base64:") {
        Write-Host "[✓] APP_KEY properly generated" -ForegroundColor Green
    } else {
        $errors += "APP_KEY not generated"
        Write-Host "[✗] APP_KEY missing or invalid" -ForegroundColor Red
        if ($AutoFix) {
            Write-Host "[AutoFix] Generating APP_KEY using artisan (if available)..." -ForegroundColor Cyan
            $artisanPath = Join-Path -Path "backend" -ChildPath "artisan"
            if (Test-Path $artisanPath) {
                Push-Location "backend"
                try {
                    & php artisan key:generate --force
                    Write-Host "[AutoFix] APP_KEY generated via artisan" -ForegroundColor Green
                } catch {
                    Write-Host "[AutoFix] Failed to run artisan key:generate. Ensure PHP is installed and in PATH." -ForegroundColor Yellow
                }
                Pop-Location
            } else {
                Write-Host "[AutoFix] artisan not found; cannot generate APP_KEY automatically" -ForegroundColor Yellow
            }
        }
    }
    
    # Check database
    if ($backendEnv -match "DB_CONNECTION=sqlite") {
        Write-Host "[✓] SQLite database configured" -ForegroundColor Green
        
        # Check if database file exists
        if (Test-Path "backend\database\database.sqlite") {
            Write-Host "[✓] SQLite database file exists" -ForegroundColor Green
        } else {
            $warnings += "SQLite database file not created yet"
            Write-Host "[!] Database file will be created on first migration" -ForegroundColor Yellow
            if ($AutoFix) {
                Write-Host "[AutoFix] Creating backend\database\database.sqlite (empty file)..." -ForegroundColor Cyan
                $dbDir = Join-Path -Path "backend" -ChildPath "database"
                if (-not (Test-Path $dbDir)) { New-Item -ItemType Directory -Path $dbDir | Out-Null }
                New-Item -Path "backend\database\database.sqlite" -ItemType File -Force | Out-Null
                Write-Host "[AutoFix] SQLite database file created" -ForegroundColor Green
            }
        }
    } else {
        $warnings += "Database not configured for SQLite"
        Write-Host "[!] Database configuration unclear" -ForegroundColor Yellow
    }
    
    # Check 2FA settings
    if ($backendEnv -match "TWO_FACTOR_ENABLED=true") {
        Write-Host "[✓] 2FA enabled in backend" -ForegroundColor Green
    } else {
        $warnings += "2FA not enabled in backend"
        Write-Host "[!] 2FA not enabled in backend" -ForegroundColor Yellow
    }
    
    # Check Sanctum domains
    if ($backendEnv -match "SANCTUM_STATEFUL_DOMAINS=localhost:3000") {
        Write-Host "[✓] Sanctum domains configured" -ForegroundColor Green
    } else {
        $errors += "Sanctum stateful domains not configured"
        Write-Host "[✗] Sanctum domains missing" -ForegroundColor Red
    }
} else {
    $errors += "Backend .env file missing"
    Write-Host "[✗] Backend .env missing" -ForegroundColor Red
    if ($AutoFix) {
        Write-Host "[AutoFix] Attempting to create backend/.env from .env.example or defaults..." -ForegroundColor Cyan
        if (Test-Path "backend\.env.example") {
            Copy-Item -Path "backend\.env.example" -Destination "backend\.env" -Force
            Write-Host "[AutoFix] Copied backend/.env.example to backend/.env" -ForegroundColor Green
        } else {
            $defaults = @()
            $defaults += "APP_ENV=local"
            $defaults += "APP_DEBUG=true"
            $defaults += "APP_KEY="
            $defaults += "DB_CONNECTION=sqlite"
            $defaults += "DB_DATABASE=database/database.sqlite"
            New-Item -Path "backend\.env" -ItemType File -Force | Out-Null
            $defaults | Set-Content -Path "backend\.env"
            Write-Host "[AutoFix] Created backend/.env with safe defaults" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Checking Dependencies..." -ForegroundColor Green

# Check node_modules
if (Test-Path "frontend\node_modules") {
    Write-Host "[✓] Frontend dependencies installed" -ForegroundColor Green
    
    # Check specific packages
    if (Test-Path "frontend\node_modules\@heroicons\react") {
        Write-Host "[✓] @heroicons/react package available" -ForegroundColor Green
    } else {
        $warnings += "@heroicons/react package missing"
        Write-Host "[!] @heroicons/react not found" -ForegroundColor Yellow
    }
} else {
    $warnings += "Frontend dependencies not installed"
    Write-Host "[!] Run 'cd frontend && npm install'" -ForegroundColor Yellow
    if ($AutoFix) {
        Write-Host "[AutoFix] Installing frontend dependencies (npm ci)..." -ForegroundColor Cyan
        if (Get-Command npm -ErrorAction SilentlyContinue) {
            Push-Location "frontend"
            try {
                npm ci
                Write-Host "[AutoFix] npm ci completed" -ForegroundColor Green
            } catch {
                Write-Host "[AutoFix] npm ci failed. Check Node/npm installation and package.json." -ForegroundColor Red
            }
            Pop-Location
        } else {
            Write-Host "[AutoFix] npm not found in PATH. Install Node.js to run npm ci." -ForegroundColor Yellow
        }
    }
}

# Check vendor
if (Test-Path "backend\vendor") {
    Write-Host "[✓] Backend dependencies installed" -ForegroundColor Green
} else {
    $warnings += "Backend dependencies not installed"
    Write-Host "[!] Run 'cd backend && composer install'" -ForegroundColor Yellow
    if ($AutoFix) {
        Write-Host "[AutoFix] Installing backend dependencies (composer install)..." -ForegroundColor Cyan
        if (Get-Command composer -ErrorAction SilentlyContinue) {
            Push-Location "backend"
            try {
                composer install --no-interaction --prefer-dist
                Write-Host "[AutoFix] composer install completed" -ForegroundColor Green
            } catch {
                Write-Host "[AutoFix] composer install failed. Check PHP/composer setup." -ForegroundColor Red
            }
            Pop-Location
        } else {
            Write-Host "[AutoFix] composer not found in PATH. Install Composer and PHP to run composer install." -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "Summary Report:" -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "✅ No critical errors found!" -ForegroundColor Green
} else {
    Write-Host "❌ Critical Errors Found:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   • $error" -ForegroundColor Red
    }
}

if ($warnings.Count -eq 0) {
    Write-Host "✅ No warnings!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Configuration Details:" -ForegroundColor White
Write-Host "• Frontend URL: http://localhost:3000" -ForegroundColor White
Write-Host "• Backend API:  http://localhost:8000/api/v1" -ForegroundColor White
Write-Host "• Database:     SQLite (development)" -ForegroundColor White
Write-Host "• 2FA System:   Email-based authentication" -ForegroundColor White
Write-Host "• Mock Auth:    Enabled for demo" -ForegroundColor White

Write-Host ""
Write-Host "To start the system:" -ForegroundColor Yellow
Write-Host "1. Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "2. Backend:  cd backend && php artisan serve" -ForegroundColor White
Write-Host "3. Access:   http://localhost:3000/login" -ForegroundColor White
Write-Host ""
Write-Host "Demo credentials:" -ForegroundColor Yellow
Write-Host "• Email: admin@test.com" -ForegroundColor White
Write-Host "• Password: password123" -ForegroundColor White
Write-Host "===============================================" -ForegroundColor Cyan

if ($AutoStart) {
    Write-Host "" -ForegroundColor Cyan
    Write-Host "[AutoStart] Attempting to start frontend and backend processes in new terminals..." -ForegroundColor Cyan

    # Start frontend (npm run dev) in a new PowerShell window if npm is available
    if (Test-Path "frontend") {
        if (Get-Command npm -ErrorAction SilentlyContinue) {
            Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command","Set-Location -Path 'frontend'; npm run dev" -WorkingDirectory (Resolve-Path "frontend").Path
            Write-Host "[AutoStart] Frontend start command issued" -ForegroundColor Green
        } else {
            Write-Host "[AutoStart] npm not found; cannot start frontend automatically" -ForegroundColor Yellow
        }
    }

    # Start backend (php artisan serve) in a new PowerShell window if PHP is available
    if (Test-Path "backend") {
        if (Get-Command php -ErrorAction SilentlyContinue) {
            Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command","Set-Location -Path 'backend'; php artisan serve --host=127.0.0.1 --port=8000" -WorkingDirectory (Resolve-Path "backend").Path
            Write-Host "[AutoStart] Backend start command issued" -ForegroundColor Green
        } else {
            Write-Host "[AutoStart] php not found; cannot start backend automatically" -ForegroundColor Yellow
        }
    }
}

Read-Host "Press Enter to continue"