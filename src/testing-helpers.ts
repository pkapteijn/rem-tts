// singletons to avoid that Jest returns a new instance each time
export const mockRepositoryFactory = () => {
    const mockDeleteSingleton = jest.fn().mockReturnThis();
    const mockExecuteSingleton = jest.fn().mockReturnThis();
    const mockFromSingleton = jest.fn().mockReturnThis();
    const mockGetManySingleton = jest.fn().mockReturnThis();
    const mockGetOneOrFailSingleton = jest.fn().mockReturnThis();
    const mockInnerJoinSingleton = jest.fn().mockReturnThis();
    const mockInnerJoinAndSelectSingleton = jest.fn().mockReturnThis();
    const mockOrderBySingleton = jest.fn().mockReturnThis();
    const mockWhereSingleton = jest.fn().mockReturnThis();
    const mockSetSingleton = jest.fn().mockReturnThis();
    const mockUpdaeSingleton = jest.fn().mockReturnThis();
  
    return {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: () => ({
        delete: mockDeleteSingleton,
        execute: mockExecuteSingleton,
        from: mockFromSingleton,
        getMany: mockGetManySingleton,
        getOneOrFail: mockGetOneOrFailSingleton,
        innerJoin: mockInnerJoinSingleton,
        innerJoinAndSelect: mockInnerJoinAndSelectSingleton,
        orderBy: mockOrderBySingleton,
        where: mockWhereSingleton,
        set: mockSetSingleton,
        update: mockUpdaeSingleton, 
      }),
    };
  }; 