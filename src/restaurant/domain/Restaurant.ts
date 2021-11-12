export default class Restaurant {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: string,
    public readonly rating: number,
    public readonly displayImageURL: string,
    public readonly address: Address,
    public readonly location: Location
  ) {}
}

export class Address {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly zipcode: string
  ) {}
}

export class Location {
  constructor(
    public readonly longitude: number,
    public readonly latitude: number
  ) {}
}
