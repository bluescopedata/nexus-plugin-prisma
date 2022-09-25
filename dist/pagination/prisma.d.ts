import { PaginationStrategy } from '.';
interface PrismaPaginationArgs {
    cursor?: object;
    take?: number;
    skip?: number;
}
export declare const prismaStrategy: PaginationStrategy<PrismaPaginationArgs>;
export {};
