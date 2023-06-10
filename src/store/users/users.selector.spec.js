import { getUserNames, getUsers } from './users.selector';


const STATE_MOCK = {
  users: {
    id: 1,
    userNames: ['ivan', 'tania', 'mariana', 'roman', 'ihor', 'oleksii', 'viktor', 'dima']
  }
}

describe('users.selector', () => {
  describe('getUsers', () => {
    it('should return users', () => {
      const actual = getUsers(STATE_MOCK)

      expect(actual).toEqual({
        id: 1,
        userNames: ['ivan', 'tania', 'mariana', 'roman', 'ihor', 'oleksii', 'viktor', 'dima']
      })
    });

    it('should return an empty object in case there is no users', () => {
      const actual = getUsers({})

      expect(actual).toEqual({})
    });

    describe('getUserNames', () => {
      it('should return userNames', () => {
        const actual = getUserNames(STATE_MOCK)

        expect(actual).toEqual(['ivan', 'tania', 'mariana', 'roman', 'ihor', 'oleksii', 'viktor', 'dima'])
      });

      it('should return an empty array in case there is no userNames', () => {
        const actual = getUserNames({})

        expect(actual).toEqual([])
      });
    });
  });
});


