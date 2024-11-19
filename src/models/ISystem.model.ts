import { ReactNode } from "react";

export interface IPaginationOptions {
    currentItems: any[],
    page: number,
    take: number,
    itemCount: number,
    pageCount: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}
export interface ITableColumn<T> {
    name: string;
    cell: (row: T) => ReactNode;
    selector?: (row: T) => any;
    sortable?: boolean;
}