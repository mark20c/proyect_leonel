# ==========================================================
#  Prepara un proyecto nuevo creado desde la plantilla.
#  1. En GitHub, en la plantilla, pulsa "Use this template" y crea el repositorio nuevo.
#  2. Ejecuta:  .\nuevo-proyecto.ps1 -Url https://github.com/usuario/nuevo-repo.git
#  El proyecto se descarga en la carpeta de al lado de esta plantilla.
# ==========================================================
param(
  [Parameter(Mandatory = $true)][string]$Url,
  [string]$Destino = (Split-Path $PSScriptRoot -Parent)
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git no está instalado. Descárgalo de https://git-scm.com" -ForegroundColor Red; exit 1
}
if ($Url -notmatch '^https://github\.com/[\w.-]+/[\w.-]+?(\.git)?/?$') {
  Write-Host "La URL no parece de un repositorio de GitHub: $Url" -ForegroundColor Red; exit 1
}

$nombre = ($Url.TrimEnd('/') -split '/')[-1] -replace '\.git$', ''
$ruta = Join-Path $Destino $nombre
if (Test-Path $ruta) {
  Write-Host "Ya existe la carpeta $ruta. Elige otro destino con -Destino." -ForegroundColor Red; exit 1
}

Write-Host "Descargando $nombre en $ruta ..." -ForegroundColor Cyan
git clone $Url $ruta
if ($LASTEXITCODE -ne 0) { Write-Host "No se pudo clonar. ¿La URL es correcta?" -ForegroundColor Red; exit 1 }

Set-Location $ruta

# El nombre del paquete pasa a ser el del repositorio nuevo
$paquete = (Get-Content package.json -Raw) -replace '"name":\s*"[^"]*"', "`"name`": `"$($nombre.ToLower())`""
[IO.File]::WriteAllText((Join-Path $ruta "package.json"), $paquete, (New-Object System.Text.UTF8Encoding $false))

if (-not (Test-Path ".env")) { Copy-Item ".env.example" ".env" }

Write-Host "Instalando dependencias (puede tardar unos minutos)..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "Proyecto listo en: $ruta" -ForegroundColor Green
Write-Host "Siguientes pasos:"
Write-Host "  1. code `"$ruta`"          (abre el proyecto en VS Code)"
Write-Host "  2. Personalízalo con la lista de PLANTILLA.md"
Write-Host "  3. npm run dev             (para verlo)"
Write-Host "  4. .\subir-a-github.ps1    (para guardar y subir los cambios)"
