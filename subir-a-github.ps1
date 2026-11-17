# ==========================================================
#  Sube este proyecto a GitHub.
#  Uso:  .\subir-a-github.ps1
#        .\subir-a-github.ps1 -Repo https://github.com/usuario/repositorio.git
#  La primera vez crea el repositorio git; las siguientes,
#  solo guarda los cambios nuevos y los sube.
# ==========================================================
param(
  [string]$Repo,
  [string]$Mensaje = "Actualización de la tienda"
)

Set-Location -Path $PSScriptRoot

function Fallar($texto) {
  Write-Host ""
  Write-Host "ERROR: $texto" -ForegroundColor Red
  exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Fallar "Git no está instalado. Descárgalo de https://git-scm.com y vuelve a abrir VS Code."
}

# 1. Archivo viejo que ya no se usa
if (Test-Path "src/config/axiosConfig.js") {
  Remove-Item "src/config/axiosConfig.js"
  Write-Host "Eliminado src/config/axiosConfig.js (ya no se usa)." -ForegroundColor DarkGray
}

# 2. Nombre y correo para los commits (solo se pide una vez)
if (-not (git config user.name)) {
  $nombre = Read-Host "Tu nombre para los commits"
  git config --global user.name "$nombre"
}
if (-not (git config user.email)) {
  $correo = Read-Host "Tu correo de GitHub"
  git config --global user.email "$correo"
}

# 3. Crear el repositorio local si no existe
if (-not (Test-Path ".git")) {
  git init | Out-Null
  Write-Host "Repositorio git creado." -ForegroundColor Green
}

# 4. Conectar con GitHub (o mantener el que ya está)
$origenActual = git remote get-url origin 2>$null
if (-not $Repo) {
  if ($origenActual) {
    $Repo = $origenActual
  } else {
    $Repo = Read-Host "Pega la URL del repositorio (ej. https://github.com/mark20c/proyect_claude.git)"
  }
}
if ($Repo -notmatch '^https://github\.com/[\w.-]+/[\w.-]+?(\.git)?/?$') {
  Fallar "La URL no parece de un repositorio de GitHub: $Repo"
}
if ($origenActual) { git remote set-url origin $Repo } else { git remote add origin $Repo }

# 5. Guardar los cambios
git add -A

# Seguridad: nunca subir el archivo .env con las claves
if (git ls-files --cached .env) {
  git rm --cached .env | Out-Null
  Fallar "El archivo .env estaba por subirse. Lo quité; revisa que .gitignore tenga la línea .env y vuelve a ejecutar."
}

if (git status --porcelain) {
  git commit -m "$Mensaje" | Out-Null
  Write-Host "Cambios guardados: $Mensaje" -ForegroundColor Green
} else {
  Write-Host "No hay cambios nuevos para guardar." -ForegroundColor DarkGray
}

# 6. Subir
git branch -M main
Write-Host "Subiendo a $Repo ..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "No se pudo subir. Causas comunes:" -ForegroundColor Yellow
  Write-Host " - No iniciaste sesión: se abrirá el navegador la próxima vez, acepta con tu cuenta."
  Write-Host " - El repositorio de GitHub ya tiene archivos (por ejemplo un README creado en la web)."
  Write-Host "   Ejecuta:  git pull origin main --rebase --allow-unrelated-histories  y luego este script otra vez."
  exit 1
}

Write-Host ""
Write-Host "Listo. Tu código está en: $($Repo -replace '\.git$','')" -ForegroundColor Green
