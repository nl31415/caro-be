import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { IRequest, IResponse, INextFunction } from "../types/Server";
import Resolve from "../helps/Resolve";

function Validation(type: any, skipMissingProperties = false) {
  return (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      // Decode and validate class
      validate(plainToClass(type, req.body), {
        skipMissingProperties,
        whitelist: true,
        forbidNonWhitelisted: true,
      }).then((errors: ValidationError[]) => {
        // Nếu trường errors tồn tại lỗi thì
        // Thực hiện trả lỗi về phía client
        if (errors.length > 0) {
          let response: any = [];
          errors.map((error: ValidationError) =>
            response.push({
              property: error.property,
              constraints: error.constraints,
            })
          );
          Resolve.invalid(req, res, response);
        } else {
          // Kiểm tra đầu vào thành công
          next();
        }
      });
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  };
}

export default Validation;
