param([ValidateSet('Store','Read')][string]$Mode,[string]$SecretPath)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
if ($Mode -eq 'Store') {
    $credentialText = [Console]::In.ReadLine()
    if ([string]::IsNullOrWhiteSpace($credentialText)) { throw 'Credencial ausente' }
    $plainBytes = [Text.Encoding]::UTF8.GetBytes($credentialText)
    $protectedBytes = [Security.Cryptography.ProtectedData]::Protect($plainBytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
    $secretFolder = Split-Path -Parent $SecretPath
    [IO.Directory]::CreateDirectory($secretFolder) | Out-Null
    [IO.File]::WriteAllBytes($SecretPath, $protectedBytes)
    [Array]::Clear($plainBytes, 0, $plainBytes.Length)
    $credentialText = $null
} else {
    $protectedBytes = [IO.File]::ReadAllBytes($SecretPath)
    $plainBytes = [Security.Cryptography.ProtectedData]::Unprotect($protectedBytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
    [Console]::Write([Text.Encoding]::UTF8.GetString($plainBytes))
    [Array]::Clear($plainBytes, 0, $plainBytes.Length)
}
