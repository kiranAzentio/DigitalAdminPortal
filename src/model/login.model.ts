export interface IUserLogin {
  username?: string;
  password?: string;
  rememberMe?: boolean,
}

export class UserLogin implements IUserLogin{
    constructor(
      public username: string,
      public password: string,
      public rememberMe?: boolean,
    ) {
      this.rememberMe = this.rememberMe || false;
    }
  }
  