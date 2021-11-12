export default class Pageable<T> {
  constructor(
    public page: number,
    public pageSize: number,
    public pageNumber: number,
    public data: T[]
  ) {}
}
