export interface Config<T> {
    filePath: string;
    raw: any;
    value: T;
}

export interface merge<T1, T2 = T1> {
    (x: Partial<T1>, y: Partial<T2>): T1 & T2;
}

export interface LoadOptions<T> {
    cwd?: string;
    context?: any;
    merge?: merge<T>;
}

export interface Plugin {
    name: string;
    extensions?: string[];
    fileNames?: string[];
    /** Executed before require/import of config file */
    register?(filePath: string): Promise<void>;
    /** Modify the config file before passing it along */
    transform?(module: any): Promise<any>;
}

interface Load<T extends Record<any, any> = Record<any, any>> {
    (namespace: string, opts?: LoadOptions<T>): Promise<Config<T>>;
    use(plugins: Plugin[]): void;
}

declare const load: Load;

export default load;
