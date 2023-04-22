# worldhopper
Example of CSV you need to put in the root directory

```csv
"1.jpeg","https://www.example.com/images/1.jpeg", "Description of this link"
"2.jpeg","https://www.example.com/images/2.jpeg", "Description of this link"
"3.jpeg","https://www.example.com/images/3.jpeg", "Description of this link"
"4.jpeg","https://www.example.com/images/4.jpeg", "Description of this link"
"5.jpeg","https://www.example.com/images/5.jpeg", "Description of this link"
"6.jpeg","https://www.example.com/images/6.jpeg", "Description of this link"
"7.jpeg","https://www.example.com/images/7.jpeg", "Description of this link"
"8.jpeg","https://www.example.com/images/8.jpeg", "Description of this link"
"9.jpeg","https://www.example.com/images/9.jpeg", "Description of this link"
```

# worldhopper Scripts


## Grab all images from the folder and make a CSV in natural order
```
Get-ChildItem -Path ".\images" -Filter *.jpeg | ForEach-Object { $_.Name + ",https://www.example.com/images/" + $_.Name } | Select-Object @{Name="FileName";Expression={($_ -split ",")[0]}},@{Name="URL";Expression={($_ -split ",")[1]}} | Sort-Object @{Expression={[int]($_.FileName -replace '\D')}}, @{Expression={$_.FileName}} | Export-Csv -Path "links.csv" -NoTypeInformation -Encoding UTF8 -Delimiter "," -Force -Append

```

## Delete the first line / headers
```
(Get-Content -Path "links.csv" | Select-Object -Skip 1) | Set-Content -Path "links.csv"
```
