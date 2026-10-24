$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$projectDir = Split-Path -Parent $PSScriptRoot
$cuePath = Join-Path $projectDir 'work/voice-cues.json'
$voiceCues = Get-Content -LiteralPath $cuePath -Raw -Encoding UTF8 | ConvertFrom-Json
$narrator = New-Object System.Speech.Synthesis.SpeechSynthesizer
$narrator.SelectVoice('Microsoft Maria Desktop')
$narrator.Rate = -2
$narrator.Volume = 100
$audioFormat = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(22050, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
foreach ($cueItem in $voiceCues) {
    $targetFile = Join-Path $projectDir ('work/audio-snippets/' + $cueItem.id + '.wav')
    $narrator.SetOutputToWaveFile($targetFile, $audioFormat)
    $narrator.Speak($cueItem.text)
    $narrator.SetOutputToNull()
    Write-Output ('Gravado: ' + $cueItem.id)
}
$narrator.Dispose()
