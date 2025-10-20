# setup.ps1 - Script de configuration du monorepo
Write-Host "🚀 Configuration du monorepo AdsCity..." -ForegroundColor Green

# Création de la structure
Write-Host "📁 Création de la structure de dossiers..." -ForegroundColor Yellow

$folders = @(
    "apps/admin",
    "apps/api", 
    "apps/app",
    "apps/auth",
    "apps/dashboard", 
    "apps/help",
    "apps/id",
    "shared/middlewares",
    "shared/utils", 
    "shared/config",
    ".github/workflows"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force
        Write-Host "✓ Créé: $folder" -ForegroundColor Green
    } else {
        Write-Host "✓ Existe déjà: $folder" -ForegroundColor Blue
    }
}

# Déplacement des applications
Write-Host "`n📦 Déplacement des applications..." -ForegroundColor Yellow

$apps = @(
    @{Source = "admin"; Target = "apps/admin"},
    @{Source = "api"; Target = "apps/api"},
    @{Source = "app"; Target = "apps/app"}, 
    @{Source = "auth"; Target = "apps/auth"},
    @{Source = "dashboard"; Target = "apps/dashboard"},
    @{Source = "help"; Target = "apps/help"},
    @{Source = "id"; Target = "apps/id"}
)

foreach ($app in $apps) {
    $source = $app.Source
    $target = $app.Target
    
    if (Test-Path $source -PathType Container) {
        if ((Get-ChildItem $source).Count -gt 0) {
            Write-Host "📂 Déplacement: $source -> $target" -ForegroundColor Cyan
            Move-Item "$source\*" $target -Force
        } else {
            Write-Host "⚠️ Dossier vide: $source" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Dossier source introuvable: $source" -ForegroundColor Red
    }
}

Write-Host "`n✅ Structure monorepo créée avec succès!" -ForegroundColor Green
Write-Host "📋 Prochaine étape: Configurer les fichiers de déploiement" -ForegroundColor Magenta