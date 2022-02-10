import oss from 'ali-oss';
interface Options {
    accessKeyId: string;
    accessKeySecret: string;
    region: string;
    bucket: string;
    folderPath: string;
    customPath?: string;
    timeout?: string;
}
declare class OssManager {
    private _options;
    constructor(options: Options);
    apply(compiler: any): void;
    clearTarget(targetPath: string): Promise<void>;
    isExists(targetPath: string): boolean;
    filterFile(folderPath: string): object[];
    initOSS(): oss;
}
export default OssManager;
