import { BaseEntity } from 'src/model/base-entity';

export class AccountingCategory implements BaseEntity {
    constructor(
        public id?: number,
        public facility?: string,
        public poDate?: string,
        public poAmount?: number,
        public lastShipmentdate?: any,
        public status?: number,
        public createdBy?: any,
        public modifiedBy?: any,
        public createDate?: any,
        public modifiedDate?: any,
    ) {
    }
}
