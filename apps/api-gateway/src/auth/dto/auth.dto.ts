export class RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class ReqUserDto {
  user: {
    id: number;
    email: string;
  };
}
