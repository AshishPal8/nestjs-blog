import { HttpException, HttpStatus } from "@nestjs/common";

export class UnauthorizedError extends HttpException {
  constructor(message: "Unauthorized access") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class BadRequestError extends HttpException {
  constructor(message = "Bad request") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundError extends HttpException {
  constructor(message = "Resource not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ForbiddenError extends HttpException {
  constructor(message = "Forbidden") {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ConflictError extends HttpException {
  constructor(message = "Resource already exists") {
    super(message, HttpStatus.CONFLICT);
  }
}
