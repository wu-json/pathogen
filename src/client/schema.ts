type ProfileFields = {
  age: number;
  exercising: boolean;
  height: number;
  occupation: string;
  state_code: string;
  country_code: string;
  weight: number;
};

export class Profile {
  age = 0;
  exercising = false;
  height = 0;
  occupation = '';
  state_code = '';
  country_code = '';
  weight = 0;

  constructor(fields: ProfileFields | undefined = undefined) {
    if (fields) {
      this.age = fields.age;
      this.exercising = fields.exercising;
      this.height = fields.height;
      this.occupation = fields.occupation;
      this.state_code = fields.state_code;
      this.country_code = fields.country_code;
      this.weight = fields.weight;
    }
  }
}

type PathogenAccountFields = {
  counter: number;
  profiles: Profile[];
};

export class PathogenAccount {
  counter = 0;
  profiles: Profile[] = [];

  constructor(fields: PathogenAccountFields | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
      this.profiles = fields.profiles;
    }
  }
}

export const PathogenSchema = new Map<any, any>([
  [
    PathogenAccount,
    {
      kind: 'struct',
      fields: [
        ['counter', 'u32'],
        // ['profiles', [Profile]],
      ],
    },
  ],
  // [
  //   Profile,
  //   {
  //     kind: 'struct',
  //     fields: [
  //       ['age', 'u8'],
  //       ['exercising', 'u8'],
  //       ['height', 'u8'],
  //       ['occupation', 'string'],
  //       ['state_code', 'string'],
  //       ['country_code', 'string'],
  //       ['weight', 'u8'],
  //     ],
  //   },
  // ],
]);
