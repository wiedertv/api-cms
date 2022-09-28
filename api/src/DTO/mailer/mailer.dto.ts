export interface ISendMail {
  email: string;
  subject: string;
  body: object;
}

export interface ISendMailResponse {
  message: string;
}
