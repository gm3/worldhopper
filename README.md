# worldhopper
Example of CSV you need to put in the root directory

```csv
1.jpg,https://www.example.com/page1.html
2.jpg,https://www.example.com/page2.html
3.jpg,https://www.example.com/page3.html
4.jpg,https://www.example.com/page4.html
5.jpg,https://www.example.com/page5.html
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