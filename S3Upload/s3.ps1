param (
    [string]$access, 
    [string]$secret, 
    [string]$file,
    [string]$bucket,    
    [string]$region, 
    [string]$prefix
)

Write-Verbose 'Entering sample.ps1'
Write-Verbose "file = $file"
Write-Verbose "bucket = $bucket"
Write-Verbose "region = $region"

# Import the Task.Common dll that has all the cmdlets we need for Build
import-module "Microsoft.TeamFoundation.DistributedTask.Task.Common"
import-module "$PSScriptRoot\ps\AWSPowerShell.psd1"

Set-AWSCredentials -AccessKey $access -SecretKey $secret
Set-DefaultAWSRegion -Region $region

if ( $applog -eq $null )
{
    Write-S3Object -BucketName $bucket -File $file    
}
else 
{
    Write-S3Object -BucketName $bucket -File $file -KeyPrefix $prefix
}