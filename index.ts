import fs from 'fs-extra'
import glob from 'glob'
import oss from 'ali-oss'
import path from 'path'
import ora from 'ora'

// 配置文件
interface Options {
  accessKeyId: string
  accessKeySecret: string
  region: string
  bucket: string
  folderPath: string // 目标文件夹的路径
  customPath?: string // 自定义路径
  timeout?: string // 超时时间
  isClean?: boolean // 清空目标文件夹
}

interface OssFile {
  path: string
  content: any
}

class OssManager {
  private _options: Options

  private client: oss

  constructor(options: Options) {
    this._options = options

    this.client = this.initOSS()
  }

  apply(compiler: any) {
    let output: string

    compiler.hooks.afterEmit.tap('OssManager', (compilation: any) => {
      return new Promise<void>((resolve, reject) => {
        output = compilation.outputOptions.path

        try {
          // 判断目标文件是否存在
          if (this.isExists(output)) {
            // 筛选文件
            let fileList: object[] = this.filterFile(path.join(output, this._options.folderPath))

            if (fileList.length > 0) {
              const spinner = ora()

              spinner.start('Upload file ......')

              Promise.all(
                fileList.map((item: any) => {
                  return this.client.put(
                    `${this._options.customPath != undefined ? this._options.customPath : ''}/${path.relative(
                      output,
                      item.path
                    )}`,
                    item.content
                  )
                })
              )
                .then((result) => {
                  spinner.succeed('upload file succeed! ')
                  resolve()
                })
                .catch((e) => {
                  spinner.fail('upload file error! Please try again!')
                  throw new Error(e)
                })

              // 是否需要清除目标文件
              if (this._options.isClean) {
                this.clearTarget(compilation.outputOptions.path).then(resolve).catch(reject)
              } else {
                resolve()
              }
            } else {
              resolve()
            }
          } else {
            throw new Error('OssManager: The target file could not be found！')
          }
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  // 清除文件
  clearTarget(targetPath: string) {
    return fs.remove(path.join(targetPath, 'assets'))
  }

  // 判断文件是否存在
  isExists(targetPath: string) {
    return fs.pathExistsSync(targetPath)
  }

  // 读取文件
  filterFile(folderPath: string): object[] {
    let folderList: string[] = glob.sync(folderPath)

    return folderList.map((item: string): OssFile => {
      return {
        path: item,
        content: fs.readFileSync(item),
      }
    })
  }

  // 初始化 OSS
  initOSS(): oss {
    return new oss({
      accessKeyId: this._options.accessKeyId,
      accessKeySecret: this._options.accessKeySecret,
      region: this._options.region,
      bucket: this._options.bucket,
      timeout: this._options.timeout || 60000,
    })
  }
}

export default OssManager
