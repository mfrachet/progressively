export interface UserRetrieveDTO {
  uuid: string;
  fullname: string;
  email: string;
}

export class UserChangeFullnameDTO {
  fullname: string;
}
