import { Query } from "mongoose";

const excludeField = ["search", "sort", "select", "page", "limit"];

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>
    public readonly query: Record<string, string>
    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter(): this {
        const filter = { ...this.query };
        for (const field of excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field]
        }
        this.modelQuery = this.modelQuery.find(filter)
        return this;
    }

    search(searchableField: string[]): this {
        const search = this.query.search || " "
        const searchTerm = { $or: searchableField.map(field => ({ [field]: { $regex: search, $options: "i" } })) }
        this.modelQuery = this.modelQuery.find(searchTerm)
        return this;
    }

    sort(): this {
        const sort = this.query.sort || "startDate"
        this.modelQuery = this.modelQuery.sort(sort)
        return this
    }
    select(): this {
        const selectFields = this.query.select?.split(',').join(" ");
        this.modelQuery = this.modelQuery.select(selectFields)
        return this
    }
    pagination(): this {
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10
        const skip = (page - 1) * limit
        this.modelQuery = this.modelQuery.skip(skip).limit(limit)
        return this
    }
    build() {
        return this.modelQuery
    }

    async meta() {
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10
        const totalDocuments = await this.modelQuery.model.countDocuments();
        const totalPage = Math.ceil(totalDocuments / limit);
        return { page, limit, total: totalDocuments, totalPage }
    }
}