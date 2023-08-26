import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user/user.entity';
import { FindOneOptions, QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import Helpers from 'src/common/helpers/helpers.helper';
import Validations from 'src/common/validations/validation';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /* ==================================================================
                   Register User
================================================================== */

  async signUp(user: User) {
    const msg = Validations.validatePassword(user.password);
    if (msg != null) return Helpers.sendNotAcceptable(msg);

    try {
      const hashedPass = await bcrypt.hash(user.password, 10);
      user.password = hashedPass;
      const usr = await this.userRepo.save(user);
      return Helpers.sendCreated(usr);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('Duplicate entry')
      ) {
        return Helpers.sendConflict('Email already exists');
      }
      throw error;
    }
  }

  /* ==================================================================
                  generate 6 digit otp
================================================================== */

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /* ==================================================================
                   send otp on email
================================================================== */

  async sendOtp({ email }) {
    const usr = await this.userRepo.findOneByOrFail({ email: email });

    if (!usr) {
      throw new Error('User not found ');
    }

    const otp = this.generateOTP();

    usr.otp = otp;
    await this.userRepo.save(usr);

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: 'network@skeletos.in',
        pass: 'Pass@2023',
      },
    });

    const mailOptions = {
      from: '"No Reply" <network@skeletos.in>',
      to: email,
      subject: 'verify email',
      html: `<p>Sip, Relax, Repeat OTP: <strong>${otp}</strong> Chill Mode On</p>`,
    };

    await transporter.sendMail(mailOptions);

    return {
      email,
      otp,
    };
  }

  /* ==================================================================
              login user via email, otp authentication
================================================================== */

  async verifyOtp({ email, otp }) {
    const usr = await this.userRepo.findOneBy({ email: email });

    if (!usr) {
      throw new Error('User not found');
    }

    if (otp !== usr.otp) {
      return Helpers.sendBadRequest('Invalid OTP');
    }

    const payload = { username: usr.email, sub: usr.id };
    const token = await this.jwtService.sign(payload);

    // update user state

    usr.isActive = true;
    await this.userRepo.save(usr);

    return { usr, token };
  }

  /* ==================================================================
                   login user via email, password authentication
================================================================== */

  async login({ email, password }) {
    const usr = await this.userRepo.findOneBy({ email: email });

    if (!usr) return Helpers.sendNotFound('Email not found');

    if (!(await bcrypt.compare(password, usr.password)))
      return Helpers.sendBadRequest('Invalid credentials');

    const payload = { username: usr.email, sub: usr.id };
    const token = await this.jwtService.sign(payload);
    usr.isActive = true;
    await this.userRepo.save(usr);

    return { usr, token };
  }

  /* ==================================================================
                  signIn with Google
================================================================== */

  async googleSignin(req: any) {
    if (!req.user) {
      return 'No user found';
    }

    // Get the user's info from the Google profile
    const userEmail = req.user.email;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;

    try {
      // Find the user in the database
      const options: FindOneOptions<User> = {
        where: { email: userEmail },
      };

      let user = await this.userRepo.findOne(options);

      if (!user) {
        const newUser = this.userRepo.create({
          fullName: `${firstName} ${lastName}`,
          email: userEmail,
          isActive: true,
        });
        user = await this.userRepo.save(newUser);
      } else {
        user.isActive = true;
        await this.userRepo.save(user);
      }

      return {
        message: 'User information from Google',
        user: req.user,
      };
    } catch (error) {
      throw new Error('Failed to sign in with Google');
    }
  }

  /* ==================================================================
                  
================================================================== */
}