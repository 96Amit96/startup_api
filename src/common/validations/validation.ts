import Helpers from '../helpers/helpers.helper';

export default class Validations {
  static validatePassword(password: string) {
    if (Helpers.containsSpace(password)) return 'No space in password';
    if (password.length >= 16) return 'less than 16 characters long';
    if (password.length < 8) return 'At least 8 characters long';
    if (!Helpers.containsNumber(password)) return 'At least 1 number';
    if (!Helpers.containsUpper(password))
      return 'At least 1 upper case character';
    if (!Helpers.containsLower(password))
      return 'At least 1 lower case character';
    if (!Helpers.containsSpecialChara(password))
      return 'At least 1 Special character';
  }
}