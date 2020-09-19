import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { Database, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { UserArgs, UserBookingsArgs, UserBookingsData, UserListingsArgs, UserListingsData } from "./types";

export const userResolvers: IResolvers = {
  Query: {
    user: async (_root: undefined, { id }: UserArgs, { db, req }: { db: Database; req: Request }): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: id });
        if (!user) {
          throw new Error("user can't be found!");
        }

        const viewer = await authorize(db, req);
        if (user._id === viewer?._id) {
          user.authorized = true;
        }

        return user;
      } catch (error) {
        throw new Error(`Failed to query user: ${error}`);
      }
    },
  },
  User: {
    id: (user: User): string => user._id,
    hasWallet: (user: User): boolean => (user.walletId ? true : false),
    income: (user: User): number | null => (user.authorized ? user.income : null),
    bookings: async (
      user: User,
      { limit, page }: UserBookingsArgs,
      { db }: { db: Database }
    ): Promise<UserBookingsData | null> => {
      try {
        if (!user.authorized) {
          return null;
        }

        const data: UserBookingsData = {
          total: 0,
          result: [],
        };

        const cursor = db.bookings.find({
          _id: { $in: user.bookings },
        });
        cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query user bookings: ${error}`);
      }
    },
    listings: async (
      user: User,
      { limit, page }: UserListingsArgs,
      { db }: { db: Database }
    ): Promise<UserListingsData> => {
      try {
        const data: UserListingsData = {
          total: 0,
          result: [],
        };

        const cursor = db.listings.find({
          _id: { $in: user.listings },
        });
        cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query user listings: ${error}`);
      }
    },
  },
};
