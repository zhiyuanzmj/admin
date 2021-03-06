export * from './dark'
export * from './agGrid'

export function download(data: any) {
  if (!data)
    return
  const a = document.createElement('a') // 创建a标签
  a.href = URL.createObjectURL(new Blob([data])) // 创建下载的链接
  a.download = data.fileName
  a.click() // 点击下载
  URL.revokeObjectURL(a.href) // 释放掉blob对象
}
