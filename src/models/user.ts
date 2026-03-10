import {ImageSourcePropType} from 'react-native';

interface IUserProfile {
  address: string;
  farmSize: string;
  id: number;
  professionType: string;
  userId: number;
  userImage: string;
  yearsOfExperience: string;
}

export interface User {
  id: any;
  name: string;
  phone: string;
  accountType: string;
  email: string;
  avatar?: ImageSourcePropType;
  profile: IUserProfile;
}
