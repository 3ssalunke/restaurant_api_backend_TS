export default interface ITokenService {
  encode(payload: string | object): string | object;
  decode(token: string): string | object;
}
