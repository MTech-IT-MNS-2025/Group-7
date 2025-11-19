# build_wasm_and_place.ps1
# Run this from the project root. It downloads emsdk if necessary and compiles myProg.c to public/myprog.js + myprog.wasm
$ErrorActionPreference = 'Stop'
$emsdkDir = "$env:USERPROFILE\emsdk"
if (-Not (Test-Path $emsdkDir)) {
  Write-Host "Downloading emsdk..."
  Invoke-WebRequest -Uri "https://github.com/emscripten-core/emsdk/archive/refs/heads/main.zip" -OutFile "$env:TEMP\emsdk.zip"
  Expand-Archive -Path "$env:TEMP\emsdk.zip" -DestinationPath $env:USERPROFILE
  Move-Item -Force -Path "$env:USERPROFILE\emsdk-main\*" -Destination $emsdkDir
  Remove-Item -Recurse -Force "$env:USERPROFILE\emsdk-main"
} else {
  Write-Host "emsdk already exists at $emsdkDir"
}
Push-Location $emsdkDir
Write-Host "Installing emsdk (this may take several minutes)..."
.\emsdk install latest
.\emsdk activate latest
& .\emsdk_env.bat
Pop-Location
$projectRoot = (Get-Location).Path
$source = Join-Path $projectRoot "myProg.c"
$public = Join-Path $projectRoot "public"
if (-Not (Test-Path $source)) { Write-Error "myProg.c not found in project root"; exit 1 }
if (-Not (Test-Path $public)) { New-Item -ItemType Directory -Path $public | Out-Null }
Write-Host "Compiling myProg.c to Emscripten outputs..."
& emcc $source -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_modexp']" -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" -o "$public\myprog.js"
Write-Host "Done. Files written to public/"
