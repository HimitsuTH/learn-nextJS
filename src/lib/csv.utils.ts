import csvToJSON from 'csvtojson'

export const csvStringToArray = async (csvFile: string) => {
  return csvToJSON().fromString(csvFile)
}

export const arrayToCsv = (header: string[], data: any[]) => {
  const csvData = data.map((d) => {
    return header
      .map((key) => {
        const text = d[key]
        const hasComma = typeof text === 'string' ? text.includes(',') : false
        return hasComma ? `"${text}"` : text
      })
      .toString()
  })

  return [header.toString(), ...csvData].join('\n')
}
