import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import Helpers from 'src/common/helpers/helpers.helper';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  /* ==================================================================
               Get User Details By ID
================================================================== */

  async getById(id: any): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: id }).catch(() => {
      return Helpers.sendNotFound();
    });
    return user;
  }

  /* ==================================================================
               check user is Eligible
================================================================== */

  // ============ Calculate user isEligible (18+) ======= //

  private calculateEligibility(dateOfBirth: Date): Date | null {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    const yearsDiff = today.getFullYear() - dob.getFullYear();

    if (yearsDiff >= 18) {
      return null;
    } else {
      const eligibleDate = new Date(dob);
      eligibleDate.setFullYear(dob.getFullYear() + 18);
      return eligibleDate;
    }
  }

  // =================================================== //

  async isEligible(dto: UserDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isActive) {
      user.dateOfBirth = dto.dateOfBirth;
      user.isEligibleDate = this.calculateEligibility(dto.dateOfBirth);
    } else {
      return null;
    }

    return await this.userRepo.save(user);
  }

  /* ==================================================================
               
================================================================== */
}