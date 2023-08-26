import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { APP_CONSTANT } from '../constants/constants';

export default class Helpers {
  static sendResponse(status: number, data: any, err: any): any {
    throw new HttpException(
      {
        statusCode: status,
        data: data,
        message: err?.message ?? err,
      },
      status,
    );
  }

  static sendOk(
    data: any,
    message: string = 'Record Retrived Successfully',
  ): any {
    return Helpers.sendResponse(HttpStatus.OK, data, message);
  }

  static sendCreated(
    data: any,
    message: string = 'Record Created Successfully',
  ): any {
    return Helpers.sendResponse(HttpStatus.OK, data, message);
  }

  static sendUpated(
    data: any,
    message: string = 'Record Updated Successfully',
  ): any {
    return Helpers.sendResponse(HttpStatus.OK, data, message);
  }

  static sendDeleted(message: string = 'Record Deleted Successfully'): any {
    return Helpers.sendResponse(HttpStatus.OK, null, message);
  }

  static sendNotFound(message: string = 'Record Not Found'): any {
    return Helpers.sendResponse(HttpStatus.NOT_FOUND, null, message);
  }

  static sendNotAcceptable(message: string = 'Record Not Acceptable'): any {
    return Helpers.sendResponse(HttpStatus.NOT_ACCEPTABLE, null, message);
  }

  static sendConflict(message: string = 'Email already exist'): any {
    return Helpers.sendResponse(HttpStatus.CONFLICT, null, message);
  }

  static sendBadRequest(err: any = 'Bad Request'): any {
    return Helpers.sendResponse(HttpStatus.BAD_REQUEST, null, err);
  }

  static async encrypt(string: string): Promise<string> {
    return await bcrypt.hash(string, 10);
  }

  static currentDate(): Date {
    return new Date();
  }

  static convertDateFormat(date: Date): string {
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  static containsNumber(str: string): boolean {
    return /\d/.test(str);
  }

  static containsUpper(str: string): boolean {
    return /[A-Z]/.test(str);
  }

  static containsLower(str: string): boolean {
    return /[a-z]/.test(str);
  }

  static containsSpecialChara(str: string): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);
  }

  static containsSpace(str: string): boolean {
    return /\s/.test(str);
  }

  static ucFirst(content: string): String {
    return content.charAt(0).toUpperCase() + content.slice(1);
  }

  /*   static isValidEmailDomain(email: string): boolean {
    const domain = email?.split('@')[1];
    return APP_CONSTANT.EMAIL_DOMAIN.includes(domain);
  } */

  static convertMinutes(minutes: number) {
    const d = Math.floor(minutes / 1440); // 60*24
    const h = Math.floor((minutes - d * 1440) / 60);
    const m = Math.round(minutes % 60);

    if (d > 0) {
      return d + ' days, ' + h + ' hours, ' + m + ' minutes';
    } else if (h > 0) {
      return h + ' hours, ' + m + ' minutes';
    } else {
      return m + ' minutes';
    }
  }

  static async compare(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}