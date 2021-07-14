interface iKeyString { [key: string]: any; }

interface tableParams {
    pageNo: number;
    pageSize: number;
    total: number;
}

interface listProps {
    list: Array<any>;
    loading: boolean;
    finished: boolean;
}