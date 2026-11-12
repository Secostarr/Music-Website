$ErrorActionPreference = 'Stop'
$python = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $python) {
    $python = Join-Path $env:LOCALAPPDATA 'Programs\Python\Python311\python.exe'
}
if (-not (Test-Path $python)) { throw 'Python 3.11 belum ditemukan. Instal Python 3.11, lalu jalankan skrip ini lagi.' }
$ffmpeg = 'D:\FDM\ffmpeg.exe'
if (-not (Test-Path $ffmpeg)) { throw 'FFmpeg tidak ditemukan di D:\FDM\ffmpeg.exe.' }
& $python -m pip install -r (Join-Path $PSScriptRoot '..\requirements-whisper.txt')
if ($LASTEXITCODE -ne 0) { throw 'Instalasi Whisper gagal.' }
Write-Host "`nPython : $python"
Write-Host "FFmpeg : $ffmpeg"
Write-Host 'Isi WHISPER_PYTHON dan WHISPER_FFMPEG di backend\.env dengan path di atas.'
Write-Host 'Model Whisper small akan diunduh otomatis saat transkripsi pertama.'
