param([string]$Voice = 'Microsoft Zira Desktop')
$ErrorActionPreference = 'Stop'
# Optional authoring tool. The website plays the checked-in MP3; learners need no speech software.
$motionWebRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$motionOutput = Join-Path $motionWebRoot 'public/motion-story'
$motionCache = Join-Path $motionWebRoot 'node_modules/.cache/motion-voice'
New-Item -ItemType Directory -Path $motionOutput,$motionCache -Force | Out-Null
Add-Type -AssemblyName System.Speech
$motionSynth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$motionSynth.SelectVoice($Voice)
$motionSynth.Rate = -1
$motionScript = Get-Content -LiteralPath (Join-Path $motionWebRoot 'src/motion-script.json') -Raw | ConvertFrom-Json
$motionTiming = @()
$motionPlaylist = @()
$motionStart = 0.0
$motionGapPath = Join-Path $motionCache 'gap.wav'
& ffmpeg -y -hide_banner -loglevel error -f lavfi -i 'anullsrc=r=22050:cl=mono' -t 0.7 $motionGapPath
if ($LASTEXITCODE -ne 0) { throw 'Could not render the narration gap.' }
try {
  foreach ($motionCue in $motionScript) {
    $motionWave = Join-Path $motionCache ($motionCue.id + '.wav')
    $motionSynth.SetOutputToWaveFile($motionWave)
    $motionSynth.Speak($motionCue.text)
    $motionSynth.SetOutputToNull()
    $motionDuration = [double](& ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $motionWave)
    if ($LASTEXITCODE -ne 0) { throw 'Could not read narration duration.' }
    $motionTiming += [ordered]@{id=$motionCue.id;start=[Math]::Round($motionStart,3);duration=[Math]::Round($motionDuration,3)}
    $motionStart += $motionDuration + 0.7
    $motionPlaylist += "file '$($motionWave.Replace('\','/'))'"
    $motionPlaylist += "file '$($motionGapPath.Replace('\','/'))'"
  }
} finally { $motionSynth.Dispose() }
$motionListPath = Join-Path $motionCache 'concat.txt'
[IO.File]::WriteAllLines($motionListPath,$motionPlaylist,(New-Object Text.UTF8Encoding($false)))
& ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i $motionListPath -ar 22050 -ac 1 -b:a 64k (Join-Path $motionOutput 'narration.mp3')
if ($LASTEXITCODE -ne 0) { throw 'Could not encode narration.' }
$motionManifest = [ordered]@{voice=$Voice;kind='temporary synthetic prototype narration';duration=[Math]::Round($motionStart,3);cues=$motionTiming}
$motionJson = $motionManifest | ConvertTo-Json -Depth 5
[IO.File]::WriteAllText((Join-Path $motionWebRoot 'src/motion-timing.json'),$motionJson + [Environment]::NewLine,(New-Object Text.UTF8Encoding($false)))
Write-Output $motionJson
