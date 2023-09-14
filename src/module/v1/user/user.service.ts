import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { environment } from 'src/common/config/environment';
import { CreateUserDto, TokenDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { QueryDto } from './dto/query.dto';
import { TokenService } from '../token/token.service';
import { SpacesService } from '../spaces/spaces.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenService: TokenService,
    private spacesService: SpacesService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      // await this.sendInBlue(createUserDto);
      const newUser = await this.userModel.create(createUserDto);
      return newUser;
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new ConflictException(
          `${Object.keys(error.keyValue)} already exists`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async addToken(token: string, user: UserDocument) {
    return await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        $addToSet: {
          tokens: token,
        },
      },
      { new: true },
    );
  }

  removeToken = async (payload: TokenDto) => {
    await this.userModel.findOneAndUpdate(
      { _id: payload.user },
      {
        $pull: {
          tokens: payload.token,
        },
      },
      { new: true },
    );
  };

  async logout(user: UserDocument) {
    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        tokens: [],
      },
      { new: true },
    );
    await this.tokenService.logout(user._id);
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 12);
  }

  async createPin(pin: string, user: UserDocument) {
    const hash = await this.hashData(pin);
    const updateUser = await this.userModel.findByIdAndUpdate(
      user._id,
      {
        pin: hash,
        hasPin: true,
      },
      { new: true },
    );

    if (!updateUser) {
      throw new BadRequestException('Could not create transaction pin');
    }
    return updateUser;
  }

  async comparePin(pin: string, currentPin: string) {
    return await bcrypt.compare(pin, currentPin);
  }

  async comparePassword(password: string, currentPassword: string) {
    return await bcrypt.compare(password, currentPassword);
  }

  async changePassword(requestData: ChangePasswordDto, user: UserDocument) {
    const { password, newPassword } = requestData;
    const comparePassword = await this.comparePassword(password, user.password);
    if (!comparePassword) {
      throw new NotFoundException('Incorrect current password');
    }
    if (password === newPassword) {
      throw new NotFoundException(
        'New password cannot be same as current password',
      );
    }
    const hash = await this.hashData(newPassword);
    const updateUser = await this.userModel.findByIdAndUpdate(
      user._id,
      {
        password: hash,
      },
      { new: true },
    );

    if (!updateUser) {
      throw new BadRequestException('Could not create password');
    }
    return updateUser;
  }

  async findById(_id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(_id);
    return user;
  }

  async findOne(query: object): Promise<UserDocument> {
    const user = await this.userModel.findOne(query);
    if (!user) {
      throw new NotFoundException(
        `user does not exist on ${environment.APP.NAME}`,
      );
    }
    return user;
  }

  async find(query: object): Promise<UserDocument[]> {
    const users = await this.userModel.find(query);
    return users ?? [];
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        `${email} does not exist on ${environment.APP.NAME}`,
      );
    }
    return user;
  }

  async fullUserDetails(query: object): Promise<UserDocument> {
    return await this.userModel.findOne(query).select('+password +pin');
  }

  async update(id, updateUserDto: object): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }
    return user;
  }

  async walletCheck(amount: number, user: UserDocument) {
    if (Number(user.wallet) < 0) {
      await this.userModel.findByIdAndUpdate(
        user._id,
        { suspend: true },
        {
          new: true,
        },
      );

      throw new InternalServerErrorException(
        'You have been suspend. Please contact support.',
      );
    }
    if (amount > user.wallet || user.wallet <= 0) {
      throw new BadRequestException(
        'Topup your wallet to continue this transaction',
      );
    }
  }

  async count() {
    const [allUser, verifiedUser, unverifiedUser, suspendedUser] =
      await Promise.all([
        this.userModel.countDocuments(),
        this.userModel.countDocuments({ 'verification.bvn': true }),
        this.userModel.countDocuments({ 'verification.bvn': false }),
        this.userModel.countDocuments({ suspend: true }),
      ]);

    return { allUser, verifiedUser, unverifiedUser, suspendedUser };
  }

  async sumWalletBalance() {
    return this.userModel.aggregate([
      {
        $group: {
          _id: null,
          wallet: { $sum: '$wallet' },
        },
      },
    ]);
  }

  async paginate(query: any) {
    // eslint-disable-next-line prefer-const
    let { currentPage, size, search, sort } = query;
    currentPage = Number(currentPage) ? Number(currentPage) : 1;
    size = Number(size) ? Number(size) : 10;

    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const searchQuery = {
      $or: [
        {
          firstName: { $regex: search, $options: 'i' },
        },
        {
          firstName: { $regex: search, $options: 'i' },
        },
        {
          email: { $regex: search, $options: 'i' },
        },
        {
          phone: { $regex: search, $options: 'i' },
        },
        {
          'account.accountNumber': { $regex: search, $options: 'i' },
        },
      ],
    };

    const [response, count] = await Promise.all([
      this.userModel
        .find(
          search
            ? {
                ...searchQuery,
                ...query,
              }
            : query,
        )
        .skip(size * (currentPage - 1))
        .limit(size)
        .sort({ createdAt: sort }),
      this.userModel
        .find(search ? { ...searchQuery, ...query } : query)
        .countDocuments(),
    ]);

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async summaryByYear(query) {
    const year = new Date().getFullYear();
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    if (query.bvn) {
      query = { ...query, 'verification.bvn': query.bvn === 'true' };
      delete query.bvn;
    }

    if (query.nin) {
      query = { ...query, 'verification.nin': query.nin === 'true' };
      delete query.nin;
    }

    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          ...query,
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          count: 1,
        },
      },
    ];

    const result = await this.userModel.aggregate(pipeline);

    const data = {};
    let currentMonth = startDate.getMonth();
    const lastMonth = endDate.getMonth();
    while (currentMonth <= lastMonth) {
      data[currentMonth + 1] = 0;
      currentMonth++;
    }
    result.forEach((item) => {
      data[item.month] = item.count;
    });

    return { year, data };
  }

  async summaryByMonth(query) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    if (query.bvn) {
      query = { ...query, 'verification.bvn': query.bvn === 'true' };
      delete query.bvn;
    }

    if (query.nin) {
      query = { ...query, 'verification.nin': query.bvn === 'true' };
      delete query.nin;
    }

    console.log({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
      ...query,
    });

    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          ...query,
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          day: '$_id',
          count: 1,
        },
      },
    ];

    const result = await this.userModel.aggregate(pipeline);

    // Fill in missing days with 0
    const data = {};
    let currentDate = startOfMonth.getDate();
    const lastDate = endOfMonth.getDate();
    while (currentDate <= lastDate) {
      data[currentDate] = 0;
      currentDate++;
    }
    result.forEach((item) => {
      data[item.day] = item.count;
    });

    return { month: now.getMonth() + 1, year: now.getFullYear(), data };
  }

  summaryByRange = async (query: QueryDto) => {
    const { startDate, endDate, nin, bvn } = query;
    let match: any = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (bvn) {
      match = { ...match, 'verification.bvn': bvn === 'true' };
    }

    if (nin) {
      match = { ...match, 'verification.nin': nin === 'true' };
    }

    const pipeline = [
      {
        $match: match,
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ];

    const result = await this.userModel.aggregate(pipeline);

    // Fill in missing days with 0
    const data = {};
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().substr(0, 10);
      data[dateString] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    result.forEach((item) => {
      console.log(item);
      data[item.date] = item.count;
    });

    return { startDate, endDate, data };
  };

  async updateVehicle(id, requestData, files = null) {
    const { carModel, manufactureYear, plateNumber, color } = requestData;

    const [imageUrl] = await Promise.all([
      this.spacesService.uploadFile(files?.image?.length > 0 && files.image[0]),
    ]);

    const uploadUrls = {
      'vehicle.image': imageUrl,
    };

    const queryParams = {
      'vehicle.carModel': carModel,
      'vehicle.manufactureYear': manufactureYear,
      'vehicle.plateNumber': plateNumber,
      'vehicle.color': color,
    };

    const data = { ...queryParams, ...uploadUrls };

    try {
      const vehicle: any = await this.userModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!vehicle) throw new NotFoundException('Vehicle not found');

      return vehicle;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateKycBank(id, requestData, files = null) {
    const { type, bankName, accountNumber, accountType, accountName } =
      requestData;

    const [frontUrl, backUrl, selfieUrl] = await Promise.all([
      this.spacesService.uploadFile(files?.front?.length > 0 && files.front[0]),
      this.spacesService.uploadFile(files?.back?.length > 0 && files.back[0]),
      this.spacesService.uploadFile(
        files?.selfie?.length > 0 && files.selfie[0],
      ),
    ]);

    const uploadUrls = {
      'kyc.front': frontUrl,
      'kyc.back': backUrl,
      'kyc.selfie': selfieUrl,
    };

    const queryParams = {
      'kyc.type': type,
      'account.bankName': bankName,
      'account.accountNumber': accountNumber,
      'account.accountName': accountName,
      'account.accountType': accountType,
    };

    const data = { ...queryParams, ...uploadUrls };

    try {
      const kycBank: any = await this.userModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!kycBank) throw new NotFoundException('Kyc&Bank not found');

      return kycBank;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async switchAvailability(id, request): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, request, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserLocation(
    driverId: string,
    longitude: number,
    latitude: number,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(
      { _id: driverId },
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      },
      { new: true },
    );
  }

  async updateProfileImage(userId: string, file: Express.Multer.File) {
    const userExist = await this.userModel.count({
      _id: userId,
    });

    if (userExist <= 0) {
      throw new NotFoundException('User not found');
    }

    const url = await this.spacesService.uploadFile(file);

    await this.userModel.updateMany(
      {
        _id: userId,
      },
      {
        profileImage: url,
      },
    );
  }

  async deleteUser(email: string) {
    await this.userModel.findOneAndDelete({ email });
  }
}
