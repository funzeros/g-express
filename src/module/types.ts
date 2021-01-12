export class DTOWrap {
  constructor(code: number, data?: any, message?: string) {
    this.code = code;
    this.data = data;
    this.message = message;
  }
  code: number;
  data?: any;
  message?: string;
}

export const DTO = {
  error: (res: any) => (message: string, data?: any) => res.json(new DTOWrap(1, data, message)),
  data: (res: any) => (data: any, message?: string) => res.json(new DTOWrap(0, data, message)),
};
