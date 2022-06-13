export interface IGridDetails {
    gridId?: string;
    queryNo?: string;
    active?: boolean,
    handler?: string;
    heading?: string;
    recordList?:any;
    param?:any;
}

export class GridDetails implements IGridDetails {
    constructor(
        public gridId?: string,
        public subGridId?:string,
        public queryNo?: string,
        public active?: boolean,
        public handler?: string,
        public heading?: string,
        public recordList?:any,
        public param?:any
    ) {
        this.active = this.active || false;
    }
}